import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Images uploaded in the admin are served from Neon Object Storage.
  images: { remotePatterns: [{ protocol: "https", hostname: "**.aws.neon.tech", pathname: "/aviva-media/**" }] },
  allowedDevOrigins : ['chemoreceptive-alvin-unpopulously.ngrok-free.dev']
};

export default nextConfig;
