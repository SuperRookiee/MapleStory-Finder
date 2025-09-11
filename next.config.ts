import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "open.api.nexon.com",
                pathname: "/static/maplestory/**",
            },
        ],
    },
    experimental: {
        viewTransition: true,
    },
};

export default nextConfig;
