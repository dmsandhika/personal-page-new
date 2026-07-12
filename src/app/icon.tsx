import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)",
          borderRadius: 7,
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 20, height: 20 }}>
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 2,
              width: 16,
              height: 4,
              borderRadius: 2,
              background: "white",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 2,
              width: 16,
              height: 4,
              borderRadius: 2,
              background: "white",
              transform: "rotate(-45deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
