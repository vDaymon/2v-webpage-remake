import { ImageResponse } from "next/og";
import { ogImageAlt } from "@/lib/site";

export const runtime = "edge";
export const alt = ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2a1450 0%, #1a0e2e 55%, #120726 100%)",
          color: "#F4EFFA",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div style={{ fontSize: 230, fontWeight: 800, letterSpacing: "-14px", lineHeight: 1 }}>
          2V
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, marginTop: 8 }}>
          Marketing · SEO · Diseño de páginas web
        </div>
        <div style={{ fontSize: 30, color: "#C8B1E4", marginTop: 22 }}>
          Agencia digital en Colombia · Medellín
        </div>
      </div>
    ),
    { ...size }
  );
}
