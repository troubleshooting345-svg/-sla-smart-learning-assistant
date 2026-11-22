const ALLOWED_ORIGIN = "https://troubleshooting345-svg.github.io";
const MODEL = "gemini-2.5-flash";

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (origin && origin !== ALLOWED_ORIGIN) {
      return new Response("Origin not allowed", { status: 403 });
    }
    const corsOrigin = origin || ALLOWED_ORIGIN;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST to send a study question." }, 405, corsOrigin);
    }
    if (!env.GEMINI_API_KEY) {
      return json({ error: "The tutor backend is missing its Gemini API secret. Ask the app administrator to finish setup." }, 503, corsOrigin);
    }

    let payload;
    try {
      const raw = await request.text();
      if (raw.length > 18000) return json({ error: "This message is too long. Please shorten it." }, 413, corsOrigin);
      payload = JSON.parse(raw);
    } catch {
      return json({ error: "The request could not be read. Please try again." }, 400, corsOrigin);
    }

    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
      return json({ error: "Please enter a study question." }, 400, corsOrigin);
    }
    const messages = payload.messages.slice(-10);
    const contents = [];
    for (const item of messages) {
      if (!item || !["user", "model"].includes(item.role) || typeof item.text !== "string") {
        return json({ error: "The chat format is invalid. Please refresh and try again." }, 400, corsOrigin);
      }
      const text = item.text.trim().slice(0, 3000);
      if (!text) continue;
      const role = item.role;
      if (contents.length && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += "\n\n" + text;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }
    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return json({ error: "Send a new question to continue." }, 400, corsOrigin);
    }

    const body = {
      systemInstruction: {
        parts: [{
          text: "You are SLA, a patient, age-appropriate study tutor for a secondary-school student in Pakistan studying FBISE Class 11 or Class 12. Explain concepts clearly in simple language, step by step, and use examples and short knowledge checks when useful. Support Biology, Chemistry, Physics, Mathematics, English and Pakistan studies. Do not claim a topic or syllabus is officially FBISE-approved unless the student supplies a reliable source. If uncertain, say so. Do not ask for passwords, addresses, contact details, or other personal information. Keep responses safe and suitable for teenagers. For medical or other high-stakes topics, provide general educational information and encourage asking a trusted adult or qualified professional. Do not provide instructions for dangerous activities."
        }]
      },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 900 }
    };

    try {
      const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify(body)
      });
      const result = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        const message = upstream.status === 429
          ? "The AI tutor is busy or its free usage limit has been reached. Please try again later."
          : upstream.status === 400
            ? "The AI provider could not process that question. Try rephrasing it."
            : "The AI tutor could not respond right now. Please try again later.";
        return json({ error: message }, upstream.status === 429 ? 429 : 502, corsOrigin);
      }
      const answer = result.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n")
        .trim();
      if (!answer) return json({ error: "The tutor returned an empty answer. Please try again." }, 502, corsOrigin);
      return json({ answer }, 200, corsOrigin);
    } catch {
      return json({ error: "Could not connect to the AI service. Please try again later." }, 502, corsOrigin);
    }
  }
};
