import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { userProfile, totalPoints } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career counselor specializing in analyzing career assessment results. Provide detailed, personalized career recommendations with specific action steps and learning paths. Be professional, encouraging, and practical in your advice.",
        },
        {
          role: "user",
          content: `Please analyze this user's career assessment responses and provide personalized recommendations:

User Profile: ${JSON.stringify(userProfile, null, 2)}
Total Points: ${totalPoints}

Please provide:
1. **Top 3-5 Career Paths** that match their profile with brief descriptions
2. **Key Skills to Develop** based on their interests and strengths
3. **Educational Recommendations** including courses, degrees, or certifications
4. **Next Steps** - specific actionable items they can start immediately
5. **Industry Insights** - growth prospects and market trends

Format the response in markdown with clear sections and bullet points for easy reading.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return NextResponse.json({
      recommendations: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error("Career recommendations API error:", error)
    return NextResponse.json({ error: "Failed to generate career recommendations" }, { status: 500 })
  }
}
