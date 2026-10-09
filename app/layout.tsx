import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./brand-effects.css";
import { BrandEffects } from "./components/brand-effects";
import { SiteCursor } from "./components/site-cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aviva — Independent Digital & Creative Agency",
  description: "Creative web solutions for modern businesses. Explore Aviva's world of design, digital experiences, and imaginative ideas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: "light" }}
      className={`${inter.variable} w-full antialiased`}
    >
      <body className="w-full overflow-x-clip">{children}<BrandEffects /><SiteCursor /></body>
    </html>
  );
}
