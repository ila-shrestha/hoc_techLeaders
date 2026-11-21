import "dotenv/config";
import cors from "cors";
import express from "express";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { guideChatHandler } from "./guideChat.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: "64kb" }));

// Neural TTS for Aasa's voice (Microsoft Edge neural voices via msedge-tts).
// en-IN-NeerjaNeural: warm natural Indian-English female; ne-NP-HemkalaNeural: native Nepali female.
const TTS_VOICES: Record<string, { voice: string; lang: string }> = {
  en: { voice: "en-IN-NeerjaNeural", lang: "en-IN" },
  ne: { voice: "ne-NP-HemkalaNeural", lang: "ne-NP" },
};

app.post("/api/tts", async (request, response) => {
  const { text, lang } = request.body ?? {};
  const clean = String(text ?? "")
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
  const cfg = TTS_VOICES[lang === "ne" ? "ne" : "en"];
  if (!clean) {
    response.status(400).json({ error: "empty text" });
    return;
  }
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(cfg.voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(clean, { rate: "-6%" });
    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Cache-Control", "no-store");
    audioStream.on("error", () => {
      if (!response.headersSent) response.status(502).end();
      else response.destroy();
    });
    audioStream.pipe(response);
    // Bound the upstream connection so a stalled synthesis can't hang forever
    setTimeout(() => response.destroy(), 20000).unref();
  } catch {
    response.status(502).json({ error: "tts unavailable" });
  }
});

app.post("/api/guide-chat", guideChatHandler);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "ward16-heritage-api" });
});

app.get("/api/heritage", (_request, response) => {
  response.json({
    data: [],
    message: "Heritage records will be served from PostgreSQL in a later phase.",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Ward 16 Heritage API listening on port ${port}`);
});
