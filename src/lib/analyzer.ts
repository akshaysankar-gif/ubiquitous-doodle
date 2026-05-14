import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-build",
});

export async function analyzeTicket(subject: string, messagesRaw: string) {
  const content = JSON.stringify({ subject, messages: messagesRaw });

  // CALL 1 — Classification
  const classificationResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a support quality analyst for a SaaS company. Analyze this support ticket (subject + conversation) and return a JSON object with exactly these fields. Be concise.",
      },
      {
        role: "user",
        content,
      },
    ],
    response_format: { type: "json_object" },
  });

  const classification = JSON.parse(classificationResponse.choices[0].message.content || "{}");

  // CALL 2 — Quality scoring
  const scoringResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a support quality assessor. Score this support ticket conversation on 4 dimensions. Return only JSON. Do NOT score pacing — no timestamps available.",
      },
      {
        role: "user",
        content,
      },
    ],
    response_format: { type: "json_object" },
  });

  const scoring = JSON.parse(scoringResponse.choices[0].message.content || "{}");

  const scoreTotal = (
    (scoring.scoreResolutionQuality || 0) +
    (scoring.scoreCommunicationClarity || 0) +
    (scoring.scoreEscalationJudgment || 0) +
    (scoring.scoreCategorizationAccuracy || 0)
  ) / 4;

  return {
    ...classification,
    ...scoring,
    scoreTotal,
  };
}
