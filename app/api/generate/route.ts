import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { topic } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Create 5 short viral TikTok hooks about ${topic}. Return them as a numbered list.`,
        },
      ],
    });

    return new Response(
      JSON.stringify({
        hook: response.choices[0].message.content,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log(error);

    return new Response(
      JSON.stringify({
        hook: "OPENAI ERROR",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}