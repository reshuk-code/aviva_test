// Technologies offered as suggestions in the admin. Those with an icon in /images/skills show it on the site.
export const technologies: { name: string; icon?: string }[] = [
  { name: "Next.js", icon: "nextdotjs" }, { name: "React", icon: "react" }, { name: "JavaScript", icon: "javascript" }, { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Vite", icon: "vite" }, { name: "Svelte", icon: "svelte" }, { name: "Nuxt", icon: "nuxt" }, { name: "WordPress", icon: "wordpress" },
  { name: "Webflow", icon: "webflow" }, { name: "Figma", icon: "figma" }, { name: "Sketch", icon: "sketch" }, { name: "Python", icon: "python" },
  { name: "Django", icon: "django" }, { name: "Flutter", icon: "flutter" }, { name: "Supabase", icon: "supabase" },
  { name: "TypeScript" }, { name: "Node.js" }, { name: "PHP" }, { name: "Laravel" }, { name: "PostgreSQL" }, { name: "MySQL" }, { name: "WooCommerce" },
  { name: "Shopify" }, { name: "Google Analytics" }, { name: "Google Ads" }, { name: "Meta Ads" }, { name: "Adobe Photoshop" }, { name: "Adobe Illustrator" },
];

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
export const techIcon = (name: string) => technologies.find((tech) => key(tech.name) === key(name))?.icon;
