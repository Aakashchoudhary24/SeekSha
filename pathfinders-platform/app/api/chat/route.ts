import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

console.log("[DEBUG] OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(0, 6) + '...' : 'NOT FOUND')

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI career counselor for students using the Pathfinders educational platform. Provide guidance on career paths, education choices, and professional development. Be encouraging, informative, and supportive. Keep responses concise but helpful.",
        },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error: any) {
    console.error("[DEBUG] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message", details: error?.message || error }, { status: 500 })
  }
}
