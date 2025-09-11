import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { type ReactNode, unstable_ViewTransition as ViewTransition } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ViewTransition enter="fade" exit="fade">{children}</ViewTransition>
                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
