interface AIRequestPayload {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

const AI_API_URL =
  (import.meta.env.VITE_AI_API_URL as string | undefined) || "/api/ai/generate";

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const generateAIText = async ({
  systemPrompt,
  userPrompt,
  temperature = 0.2,
}: AIRequestPayload) => {
  if (!AI_API_URL) {
    throw new Error("缺少 VITE_AI_API_URL 配置");
  }

  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemPrompt,
      userPrompt,
      temperature,
    }),
  });

  const data = await readJson(response);
  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? (data as { message?: string }).message
        : undefined;
    throw new Error(message || "AI 生成失败");
  }

  const content =
    data && typeof data === "object"
      ? (data as { text?: string }).text
      : undefined;
  if (!content || typeof content !== "string") {
    throw new Error("AI 返回内容为空");
  }

  return content.trim();
};
