import localFont from "next/font/local";
import Script from "next/script";
import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MaintenanceDialog } from "@/components/common/MaintenanceDialog";
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
    applicationName: "MapleStory Finder",
    manifest: "/manifest.webmanifest",
    icons: {
        icon: [
            {
                url: "/Reheln.ico",
            },
            {
                url: "/Reheln.png",
                type: "image/png",
                sizes: "512x512",
            },
        ],
        apple: {
            url: "/Reheln.png",
            sizes: "180x180",
        },
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FF8000FF" },
        { media: "(prefers-color-scheme: dark)", color: "#FF7F00FF" },
    ],
};

const isProduction = process.env.NODE_ENV === "production";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={`${mapleStory.className} ${mapleStory.variable} antialiased`}>
                <Script id="language-script" strategy="beforeInteractive">
                    {`
                        (() => {
                          try {
                            const stored = localStorage.getItem('finder_language');
                            const next = stored === 'en' || stored === 'ko' ? stored : 'ko';
                            document.documentElement.lang = next;
                          } catch (e) {
                            document.documentElement.lang = 'ko';
                          }
                        })();
                    `}
                </Script>
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

                {isProduction ? (
                    <Script id="pwa-service-worker" strategy="afterInteractive">
                        {`
                            if ('serviceWorker' in navigator) {
                              window.addEventListener('load', () => {
                                navigator.serviceWorker.register('/service-worker.js').catch((error) => {
                                  console.error('Service worker registration failed:', error);
                                });
                              });
                            }
                        `}
                    </Script>
                ) : null}

                <LanguageProvider>
                    <AuthProvider>
                        <ViewTransition enter="fade" exit="fade">{children}</ViewTransition>
                        <MaintenanceDialog />
                        <Toaster />
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
};

export default RootLayout;