import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Image to Audio Accessibility Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, #1e293b 0%, #020617 55%, #000000 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #38bdf8, #0ea5e9, #0284c7)",
          }}
        />

        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Icon: eye + sound waves */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "88px",
            height: "88px",
            borderRadius: "22px",
            background: "rgba(56,189,248,0.08)",
            border: "1.5px solid rgba(56,189,248,0.25)",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Eye */}
            <div
              style={{
                width: "34px",
                height: "20px",
                borderRadius: "50%",
                border: "2px solid #38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#38bdf8",
                }}
              />
            </div>
            {/* Sound wave bars */}
            <div
              style={{ display: "flex", gap: "4px", alignItems: "center" }}
            >
              <div
                style={{
                  width: "3px",
                  height: "8px",
                  background: "#38bdf8",
                  borderRadius: "2px",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "14px",
                  background: "#38bdf8",
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "10px",
                  background: "#38bdf8",
                  borderRadius: "2px",
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "6px",
                  background: "#38bdf8",
                  borderRadius: "2px",
                  opacity: 0.4,
                }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: "700",
            color: "#f8fafc",
            letterSpacing: "-2px",
            margin: "0 0 18px 0",
            textAlign: "center",
            lineHeight: "1.05",
            display: "flex",
          }}
        >
          Image to Audio
        </div>

        {/* Accent tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#38bdf8",
            margin: "0 0 20px 0",
            textAlign: "center",
            fontWeight: "500",
            display: "flex",
          }}
        >
          AI-powered spoken descriptions for every image
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            margin: "0 0 52px 0",
            textAlign: "center",
            maxWidth: "620px",
            display: "flex",
          }}
        >
          Upload an image. Hear what&apos;s in it. Built for blind and
          low-vision users.
        </div>

        {/* Author pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 22px",
            borderRadius: "100px",
            background: "rgba(248,250,252,0.05)",
            border: "1px solid rgba(248,250,252,0.1)",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "17px", display: "flex" }}>
            by
          </span>
          <span
            style={{
              color: "#cbd5e1",
              fontSize: "17px",
              fontWeight: "500",
              display: "flex",
            }}
          >
            Marco Fernstaedt
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #38bdf8, transparent)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
