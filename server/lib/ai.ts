import type { Request } from "express";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function generateAIReply(messages: ChatMessage[], context: Record<string, any>) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_PUBLIC;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  // Compose a compact system prompt with learning context
  const systemPrompt = `You are a friendly language conversation tutor. Keep replies short (2-4 sentences),
use the target language unless the user asks for help. Correct gently and provide one suggestion.
Context: ${JSON.stringify({
    courseTitle: context.courseTitle,
    lessonTitle: context.lessonTitle,
    topicTitle: context.topicTitle,
    activityType: context.activityType,
    promptSet: context.promptSet,
  })}`;

  const finalMessages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...messages];

  // If no API key, return a mock response to avoid breaking local dev
  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const echo = lastUser?.content?.slice(0, 200) || "Let's begin.";
    return {
      role: "assistant",
      content:
        `Mock tutor: ${echo}\n\nSuggestion: Try a variation or ask a follow-up question.`,
    } as ChatMessage;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: finalMessages,
      temperature: 0.6,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`AI request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "(No response)";
  return { role: "assistant", content } as ChatMessage;
}

export type { ChatMessage };


