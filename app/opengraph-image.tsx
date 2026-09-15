import { ImageResponse } from "next/og";

export const alt = "Nexode AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#000000",
          color: "#e8e8e8",
          padding: 72,
          border: "2px solid rgba(232,232,232,0.35)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a8a8a",
          }}
        >
          Nexode AI
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 650,
            lineHeight: 0.95,
            letterSpacing: -2,
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          Ship Product
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8a8a8a",
          }}
        >
          Web · Mobile · Automation · AI
        </div>
      </div>
    ),
    { ...size },
  );
}
