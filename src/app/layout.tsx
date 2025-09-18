import localFont from "next/font/local";
import Script from "next/script";
import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

const mapleStory = localFont({
    src: [
        {
            path: "../../public/fonts/NEXON_Maplestory/TTF/Maplestory Light.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/NEXON_Maplestory/TTF/Maplestory Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-maplestory",
});

export const metadata: Metadata = {
    title: "Finder",
    description: "MapleStory Finder",
    icons: {
        icon: "/Reheln.ico",
    },
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${mapleStory.className} ${mapleStory.variable} antialiased`}>
        {/* 테마 스크립트 (inline) */}
        <Script id="theme-script" strategy="beforeInteractive">
            {`
                (() => {
                  try {
                    const t = localStorage.getItem('theme');
                    if (t === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  } catch (e) {}
                })();
            `}
        </Script>

        {/* 넥슨 Analytics 스크립트 (외부 src) */}
        <Script
            src={`https://openapi.nexon.com/js/analytics.js?app_id=${process.env.NEXT_PUBLIC_NEXON_APP_ID}`}
            strategy="afterInteractive"
        />

        <LanguageProvider>
            <AuthProvider>
                <ViewTransition enter="fade" exit="fade">{children}</ViewTransition>
                <Toaster />
            </AuthProvider>
        </LanguageProvider>
        </body>
        </html>
    );
};

export default RootLayout;