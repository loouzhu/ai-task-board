export type ApiErrorCode =
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "ABORTED"
  | "PARSE_ERROR"
  | "UNKNOWN_ERROR";

export interface ApiErrorOptions {
  message: string;
  // HTTP 状态码；网络错误、超时等没有响应的场景下不存在。
  status?: number;
  // 前端错误类别。
  code?: ApiErrorCode;
  url?: string;
  method?: string;
  details?: unknown;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code: ApiErrorCode;
  readonly url?: string;
  readonly method?: string;
  readonly details?: unknown;
  override readonly cause?: unknown;

  constructor({
    message,
    status,
    code = "UNKNOWN_ERROR",
    url,
    method,
    details,
    cause,
  }: ApiErrorOptions) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.url = url;
    this.method = method;
    this.details = details;
    this.cause = cause;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;
