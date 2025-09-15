import localFont from "next/font/local";
import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const mapleStory = localFont({
    src: [
        {
            path: "../../public/font/NEXON_Maplestory/TTF/Maplestory Light.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/font/NEXON_Maplestory/TTF/Maplestory Bold.ttf",
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
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(() => { try { const t = localStorage.getItem('theme'); if (t === 'dark') { document.documentElement.classList.add('dark'); } } catch (e) {} })();`,
                    }}
                />
                <ViewTransition enter="fade" exit="fade">{children}</ViewTransition>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;

