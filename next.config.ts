import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "i.pinimg.com",
    },
    {
      protocol: "https",
      hostname: "images.uzum.uz",
    },
  ],
},
};

export default nextConfig;
