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

    const { topic, style } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert viral content creator specialized in ${style} content.`,
        },
        {
          role: "user",
          content: `Create 5 EXTREMELY viral ${style} hooks about "${topic}".

Rules:
- Make them short
- Make them emotional
- Use curiosity
- Sound modern and natural
- Add emojis sometimes
- Return ONLY the hooks
- Number them 1-5
- Do NOT explain anything
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