import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "i.pinimg.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  allowedDevOrigins: ["tipoff-explode-hundredth.ngrok-free.dev"],
};

export default nextConfig;
