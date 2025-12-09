import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { isSpoofedBot } from "@arcjet/inspect";

// --------------------
// OpenAI Client
// --------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --------------------
// Force Node Runtime (required for Buffer + audio)
// --------------------
export const runtime = "nodejs";

// --------------------
// Limits
// --------------------
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// --------------------
// Arcjet Protection
// --------------------
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // 5 requests
      interval: 60,  // per 60 seconds
      capacity: 5,
    }),
  ],
});

// --------------------
// Image Extraction
// --------------------
const extractImageDataUrl = async (req: NextRequest): Promise<string | null> => {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.startsWith("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) return null;
    if (!file.type.startsWith("image/")) return null;
    if (file.size > MAX_FILE_SIZE_BYTES) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/png";
    const base64 = buffer.toString("base64");

    return `data:${mime};base64,${base64}`;
  }

  try {
    const json = await req.json();
    const imageBase64 = json?.imageBase64;

    if (typeof imageBase64 !== "string") return null;
    if (!imageBase64.startsWith("data:image")) return null;

    return imageBase64;
  } catch {
    return null;
  }
};

// --------------------
// POST Handler
// --------------------
export const POST = async (req: NextRequest) => {
  // ✅ Arcjet Protection First
  const decision = await aj.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    if (decision.reason.isBot()) {
      return NextResponse.json({ error: "No bots allowed" }, { status: 403 });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (decision.ip.isHosting()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ Main AI Pipeline
  try {
    const imageDataUrl = await extractImageDataUrl(req);

    if (!imageDataUrl) {
      return new Response("Invalid or missing image data", { status: 400 });
    }

    // 1️⃣ Vision Description
    const visionRes = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You describe images to blind and low-vision users in a concise, clear way.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Describe this image for a blind user in 1–2 clear sentences. " +
                "Focus on key objects, layout, and any important visible text. Avoid filler.",
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
    });

    const rawContent = visionRes.choices[0]?.message?.content;

    const description =
      (typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
        ? rawContent.map((p: any) => p?.text ?? "").join(" ")
        : "")
        .trim()
        .slice(0, 800) || "No description available.";

    // 2️⃣ Text-to-Speech
    const ttsRes = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "onyx",
      input: description,
      format: "mp3",
    });

    const audioArrayBuffer = await ttsRes.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=description.mp3",
        "Cache-Control": "no-store",
        "X-Description-Text": encodeURIComponent(description),
      },
    });
  } catch (error) {
    console.error("Error in /api/describe-image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
