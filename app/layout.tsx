import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabsha Clothing Studio",
  description: "Premium men's, women's, and accessory pieces — designed for a modern wardrobe.",
  openGraph: {
    title: "Tabsha Clothing Studio",
    description: "Premium men's, women's, and accessory pieces — designed for a modern wardrobe.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning on body: browser extensions (ColorZilla, Grammarly, etc.)
          inject attributes like cz-shortcut-listen before React hydrates. That's a mismatch
          on this element only, not a real bug in the app — this tells React to ignore it here. */}
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
