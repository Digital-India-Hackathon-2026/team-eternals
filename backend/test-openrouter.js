require("dotenv").config();

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not set.");
    return;
  }

  const prompt = `You are a clinical triage AI. Respond with a valid JSON in this format: { "status": "complete", "report": { "priority": "Medium", "department": "Cardiology" } }`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://smarthealthai.dev",
        "X-Title": "SmartHealthAI"
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error calling OpenRouter:", err);
  }
}

testOpenRouter();
