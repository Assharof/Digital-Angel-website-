import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Digital Angel — Where Knowledge Creates Freedom",
    template: "%s | Digital Angel",
  },
  description:
    "Digital Angel is a digital publishing brand delivering practical eBooks and educational resources for healthier, wiser, more successful living.",
  keywords: [
    "Digital Angel",
    "eBooks",
    "health and wellness guides",
    "parenting resources",
    "personal development",
    "digital skills",
  ],
  openGraph: {
    title: "Digital Angel — Where Knowledge Creates Freedom",
    description: "Practical knowledge you can trust and use.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        className="bg-white text-slate-800 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
