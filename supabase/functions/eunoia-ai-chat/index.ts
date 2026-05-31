const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function detectContext(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes("exam") ||
    lower.includes("test") ||
    lower.includes("study") ||
    lower.includes("fail") ||
    lower.includes("marks")
  ) {
    return "exam_stress";
  }

  if (
    lower.includes("parent") ||
    lower.includes("mom") ||
    lower.includes("dad") ||
    lower.includes("scold") ||
    lower.includes("fight") ||
    lower.includes("shout")
  ) {
    return "family_conflict";
  }

  if (
    lower.includes("new school") ||
    lower.includes("new class") ||
    lower.includes("classmates") ||
    lower.includes("school anxiety")
  ) {
    return "new_school_anxiety";
  }

  if (
    lower.includes("lonely") ||
    lower.includes("alone") ||
    lower.includes("no friends") ||
    lower.includes("ignored") ||
    lower.includes("left out")
  ) {
    return "loneliness";
  }

  return "general_support";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const groqKey = Deno.env.get("GROQ_API_KEY");

    if (!groqKey) {
      return new Response(
        JSON.stringify({
          reply: "Groq API key is missing in Supabase secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { messages = [], language = "English" } = await req.json();

    const safeMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role,
        content: String(m.content || ""),
      }));

    const latestUserMessage =
      [...safeMessages].reverse().find((m: any) => m.role === "user")?.content ||
      "";

    const detectedContext = detectContext(latestUserMessage);

    const systemPrompt = `
You are Eunoia, a warm, emotionally intelligent mental wellness companion.

Reply in ${language}.

Core rules:
- Reply in 3 to 4 sentences only.
- Use simple, natural, human language.
- Be warm, calming, supportive, and non-judgmental.
- Validate the user's feelings naturally.
- Do not sound robotic or overly clinical.
- Sometimes ask one gentle follow-up question.
- Sometimes comfort without asking a question.
- Do not diagnose.
- Do not prescribe medicine.
- Do not say you are a licensed therapist.

Detected context: ${detectedContext}

Context guidance:
If the context is exam_stress:
- Validate pressure, fear of failure, and overthinking.
- Encourage one small study step, short breaks, sleep, and breathing.
- Avoid saying "just study harder."

If the context is family_conflict:
- Validate hurt, anger, guilt, or sadness.
- Do not blame the user or parents.
- Suggest calming down first, then talking later when emotions are lower.
- Encourage writing feelings before speaking.

If the context is new_school_anxiety:
- Normalize feeling nervous in a new place.
- Suggest finding one safe person, one routine, or one small daily goal.
- Avoid forcing social confidence too quickly.

If the context is loneliness:
- Validate emptiness and feeling disconnected.
- Encourage one small connection: message someone, sit near others, join one activity.
- Avoid saying "just make friends."

Safety:
If the user mentions suicide, self-harm, abuse, violence, or immediate danger:
- Take it seriously.
- Encourage contacting a trusted person immediately.
- Encourage local emergency services or crisis support.
- Do not continue casual coaching.
`;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...safeMessages,
          ],
          temperature: 0.75,
          max_tokens: 500,
        }),
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return new Response(
        JSON.stringify({
          reply: `Groq API error: ${
            data?.error?.message || JSON.stringify(data)
          }`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        reply:
          data?.choices?.[0]?.message?.content ||
          "I'm here with you. Tell me a little more about what you're feeling.",
        context: detectedContext,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        reply: `Function error: ${String(error)}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});