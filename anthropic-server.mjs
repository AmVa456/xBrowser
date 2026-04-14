import http from "http";
import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

config();

const PORT = process.env.ANTHROPIC_PORT || 8787;
const API_KEY = process.env.X_ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.warn("[anthropic-server] Missing X_ANTHROPIC_API_KEY in environment.");
}

const client = new Anthropic({
  apiKey: API_KEY,
});

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.method === "POST" && req.url === "/api/anthropic") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body || "{}");
        const prompt = parsed.prompt ?? "";

        if (!API_KEY) {
          res.writeHead(500, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          return res.end(
            JSON.stringify({
              error: "Missing X_ANTHROPIC_API_KEY on server.",
            })
          );
        }

        if (!prompt.trim()) {
          res.writeHead(400, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          return res.end(JSON.stringify({ error: "Prompt is required." }));
        }

        const completion = await client.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        });

        const text =
          completion?.content?.[0]?.text ??
          JSON.stringify(completion, null, 2);

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify({ text }));
      } catch (err) {
        console.error("[anthropic-server] Error:", err);
        res.writeHead(500, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({
            error: "Anthropic request failed.",
          })
        );
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`[anthropic-server] Listening on http://localhost:${PORT}`);
});
