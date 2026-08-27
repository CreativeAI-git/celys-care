import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text || !text.trim()) {
      return new NextResponse("Text parameter is required", { status: 400 });
    }

    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—*_~`#]/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    if (!cleanText) {
      return new NextResponse("Empty text after sanitization", { status: 400 });
    }

    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
        Accept: "audio/mpeg,audio/*;q=0.9",
      },
    });

    if (!response.ok) {
      console.warn("TTS fetch responded with status:", response.status);
      return new NextResponse("TTS stream fetch error", { status: response.status });
    }

    const audioArrayBuffer = await response.arrayBuffer();

    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioArrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=604800, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return new NextResponse("Internal Server Error in TTS proxy", { status: 500 });
  }
}
