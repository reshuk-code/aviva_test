import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./brand-effects.css";
import { BrandEffects } from "./components/brand-effects";
import { SiteCursor } from "./components/site-cursor";
import { TopLoader } from "./components/top-loader";
import { Suspense } from "react";
import { getSettings } from "./lib/content";
import { siteUrl } from "./lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Site-wide defaults from Settings; each page refines them (see lib/seo.ts).
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  return {
    metadataBase: new URL(await siteUrl()),
    title: settings?.siteName || "Aviva Web Technology",
    description: settings?.defaultDescription,
    openGraph: { siteName: settings?.siteName, images: settings?.defaultImage ? [{ url: settings.defaultImage }] : undefined },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: "light" }}
      className={`${inter.variable} w-full antialiased`}
    >
      <body className="w-full overflow-x-clip"><Suspense><TopLoader /></Suspense>{children}<BrandEffects /><SiteCursor /></body>
    </html>
  );
}
