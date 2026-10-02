import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 112,
          background: "#080812",
          color: "white",
          fontSize: 150,
          fontWeight: 900,
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: 999,
            background: "rgba(124,58,237,.25)",
            left: 30,
            top: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: 999,
            background: "rgba(34,211,238,.18)",
            right: -30,
            bottom: -50,
          }}
        />
        <span style={{ position: "relative" }}>BB</span>
      </div>
    ),
    { ...size },
  );
}
