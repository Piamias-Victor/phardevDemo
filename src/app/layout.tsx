import type { Metadata } from "next";
import { Inter, Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/cursor/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon"
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phardev | La Renaissance Digitale",
  description: "Solutions digitales premium pour pharmacies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${pinyon.variable} ${playfair.variable} antialiased selection:bg-amber-500/30 selection:text-amber-200`}>
        <div className="grain" />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
