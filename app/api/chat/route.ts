import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const chatCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:fireworks-ai",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Hugging Face Router API Error:", error);
    return NextResponse.json(
      { error: error.message || "خطا در دریافت پاسخ" },
      { status: 500 }
    );
  }
}
