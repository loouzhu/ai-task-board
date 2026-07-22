import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

router.post("/generate", async (req: Request, res: Response) => {
  const systemPrompt = getString(req.body?.systemPrompt);
  const userPrompt = getString(req.body?.userPrompt);
  const temperature = getNumber(req.body?.temperature, 0.2);

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({ success: false, message: "缺少必要参数" });
  }

  const apiUrl = process.env.AI_API_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiUrl || !apiKey) {
    return res.status(500).json({ success: false, message: "AI 配置缺失" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg =
        typeof data?.error?.message === "string"
          ? data.error.message
          : "AI 代理失败";
      return res.status(response.status).json({ success: false, message: msg });
    }

    const text =
      typeof data?.choices?.[0]?.message?.content === "string"
        ? data.choices[0].message.content.trim()
        : typeof data?.output_text === "string"
          ? data.output_text.trim()
          : "";

    if (!text) {
      return res.status(502).json({ success: false, message: "AI 返回为空" });
    }

    return res.status(200).json({ success: true, text });
  } catch (err: any) {
    const msg = err?.name === "AbortError" ? "AI 请求超时" : "AI 代理失败";
    return res.status(500).json({ success: false, message: msg });
  } finally {
    clearTimeout(timer);
  }
});

export default router;
