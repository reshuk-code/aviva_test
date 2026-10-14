import type { Metadata } from "next";
import { pageMetadata } from "./lib/seo";

export { default } from "./homepage";

// Content comes from the CMS, so render on request (the data itself is cached; see lib/content.ts).
export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("home");
