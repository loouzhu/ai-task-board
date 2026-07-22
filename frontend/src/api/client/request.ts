import { ApiError } from "./ApiError";

export type ResponseType = "json" | "text" | "blob" | "void";

export interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  responseType?: "json" | "text" | "blob" | "void";
  credentials?: RequestCredentials;
  timeout?: number;
}

const HTTP_ERROR_MESSAGES: Partial<Record<number, string>> = {
  400: "请求参数错误",
  401: "登录状态已失效",
  403: "没有操作权限",
  404: "请求的资源不存在",
  409: "数据状态冲突",
  413: "上传内容过大",
  500: "服务器内部错误",
  502: "网关错误",
  503: "服务暂时不可用",
  504: "网关响应超时",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBodyInit = (body: unknown): body is BodyInit =>
  typeof body === "string" ||
  body instanceof Blob ||
  body instanceof FormData ||
  body instanceof URLSearchParams ||
  body instanceof ArrayBuffer ||
  ArrayBuffer.isView(body) ||
  body instanceof ReadableStream;

const inferResponseType = (response: Response): ResponseType => {
  if (response.status === 204 || response.status === 205) {
    return "void";
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json") || contentType.includes("+json")) {
    return "json";
  }

  if (contentType.startsWith("text/")) {
    return "text";
  }

  if (
    contentType.includes("application/octet-stream") ||
    contentType.includes("application/pdf") ||
    contentType.includes("application/zip") ||
    contentType.startsWith("image/") ||
    contentType.startsWith("audio/") ||
    contentType.startsWith("video/")
  ) {
    return "blob";
  }

  // 兼容没有正确返回 Content-Type 的旧接口。
  return "json";
};

const parseResponse = async (
  response: Response,
  responseType: ResponseType,
  requestInfo: Pick<RequestOptions, "url" | "method">,
): Promise<unknown> => {
  if (responseType === "void") {
    return undefined;
  }

  if (responseType === "blob") {
    return response.blob();
  }

  const text = await response.text();
  if (responseType === "text" || text.length === 0) {
    return responseType === "text" ? text : undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (cause) {
    // HTTP 错误应保留其状态和原始响应，而不是被解析错误覆盖。
    if (!response.ok) {
      return text;
    }

    throw new ApiError({
      message: "服务器返回的数据格式不正确",
      status: response.status,
      code: "PARSE_ERROR",
      url: requestInfo.url,
      method: requestInfo.method,
      details: text,
      cause,
    });
  }
};

const getErrorMessage = (details: unknown, response: Response): string => {
  if (isRecord(details)) {
    for (const key of ["message", "error", "msg"] as const) {
      const value = details[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }

  if (typeof details === "string" && details.trim()) {
    return details;
  }

  return (
    HTTP_ERROR_MESSAGES[response.status] ||
    response.statusText ||
    `请求失败（${response.status}）`
  );
};

export async function request<T>(options: RequestOptions): Promise<T> {
  const {
    url,
    method = "GET",
    headers,
    body,
    signal,
    responseType,
    credentials = "include",
    timeout,
  } = options;
  const requestHeaders = new Headers(headers);
  const controller = new AbortController();
  let didTimeout = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const abortFromExternalSignal = () => controller.abort(signal?.reason);

  if (signal?.aborted) {
    abortFromExternalSignal();
  } else {
    signal?.addEventListener("abort", abortFromExternalSignal, { once: true });
  }

  if (timeout !== undefined && timeout > 0) {
    timeoutId = globalThis.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, timeout);
  }

  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
    signal: controller.signal,
    credentials,
  };

  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      requestConfig.body = body;
    } else {
      requestConfig.body = JSON.stringify(body);
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
      }
    }
  }

  try {
    const response = await fetch(url, requestConfig);
    // 错误响应不能因为调用方指定了 void/blob 而丢失服务端错误详情。
    const actualResponseType = response.ok
      ? (responseType ?? inferResponseType(response))
      : inferResponseType(response);
    const data = await parseResponse(response, actualResponseType, {
      url,
      method,
    });

    if (!response.ok) {
      throw new ApiError({
        message: getErrorMessage(data, response),
        status: response.status,
        code: "HTTP_ERROR",
        url,
        method,
        details: data,
      });
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (didTimeout) {
      throw new ApiError({
        message: "请求超时，请稍后重试",
        code: "TIMEOUT",
        url,
        method,
        cause: error,
      });
    }

    if (controller.signal.aborted) {
      throw new ApiError({
        message: "请求已取消",
        code: "ABORTED",
        url,
        method,
        cause: error,
      });
    }

    if (error instanceof TypeError) {
      throw new ApiError({
        message: "网络连接失败，请检查网络或稍后重试",
        code: "NETWORK_ERROR",
        url,
        method,
        cause: error,
      });
    }

    throw new ApiError({
      message: "请求失败，请稍后重试",
      code: "UNKNOWN_ERROR",
      url,
      method,
      cause: error,
    });
  } finally {
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId);
    }
    signal?.removeEventListener("abort", abortFromExternalSignal);
  }
}
