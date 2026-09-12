import { ImageResponse } from "next/og";

export const alt = "Nexode AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0A0A0A",
          color: "#F4F1EC",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#8A8680",
            textTransform: "uppercase",
          }}
        >
          Nexode AI
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 650,
            lineHeight: 1.08,
            maxWidth: 920,
            letterSpacing: -1.5,
          }}
        >
          Software that makes investors ask how.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#8A8680",
            letterSpacing: 1,
          }}
        >
          Web · Mobile · Automation · AI
        </div>
      </div>
    ),
    { ...size },
  );
}
