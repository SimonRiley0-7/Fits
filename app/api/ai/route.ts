import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    system: system || "You are a helpful assistant. Be concise and friendly.",
    messages,
  });
  return result.toTextStreamResponse();
}
