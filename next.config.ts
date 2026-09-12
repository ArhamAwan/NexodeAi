import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phone testing over LAN needs this — otherwise /_next assets are blocked
  // and the site looks blank / half-loaded on real devices.
  allowedDevOrigins: [
    "192.168.0.128",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
