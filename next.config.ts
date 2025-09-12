import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "open.api.nexon.com",
                pathname: "/static/maplestory/**", // API
            },
            {
                protocol: "https",
                hostname: "lwi.nexon.com",
                pathname: "/maplestory/**", // artwork 이미지 경로
            },
            {
                protocol: "https",
                hostname: "ssl.nexon.com",
                pathname: "/s2/game/maplestory/**", // Nexon SSL 이미지
            },
        ],
    },
    experimental: {
        viewTransition: true,
    },
};

export default nextConfig;
