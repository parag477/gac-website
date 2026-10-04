import { ImageResponse } from "next/og";
export const alt = "Green Arc Commune — Learn the market. Grow together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#173c30",
        color: "#f5f3ea",
        width: "100%",
        height: "100%",
        padding: 75,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28 }}>GREEN ARC COMMUNE</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 86,
          lineHeight: 1.05,
        }}
      >
        <span>Learn the market.</span>
        <span style={{ color: "#d7ef8f" }}>Grow together.</span>
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        Trading education with Shubham Soni
      </div>
    </div>,
    size,
  );
}
