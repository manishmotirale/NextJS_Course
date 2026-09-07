import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #000, #333)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 60,
        fontWeight: "bold",
      }}
    >
      <div style={{ fontSize: 40, opacity: 0.8 }}>Manish Motirale </div>

      <div style={{ marginTop: 20 }}>{slug}</div>
    </div>,
  );
}
