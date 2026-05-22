import OpenAI from "openai";

let lastRequestTime = 0;

export async function POST(req: Request) {
  const now = Date.now();

  if (now - lastRequestTime < 5000) {
    return new Response(
      JSON.stringify({
        hook: "Please wait 5 seconds before generating again.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  lastRequestTime = now;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { topic } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a viral TikTok hook generator. Create highly engaging, curiosity-driven hooks that make people want to stop scrolling immediately.",
        },
        {
          role: "user",
          content: `Create 5 EXTREMELY viral TikTok hooks about "${topic}".

Rules:
- Make them short
- Make them emotional
- Use curiosity
- Sound natural and modern
- Add emojis sometimes
- Return ONLY the hooks
- Number them 1-5
- Do NOT explain anything

Good example:
1. "Nobody talks about this Fortnite trick... 😳"
2. "I tried the weirdest Minecraft strategy and THIS happened 🤯"
`,
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