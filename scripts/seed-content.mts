// Starting content for a fresh database (see db-setup.mts). After setup, edit content in /admin.

export const categories = ["SEO Optimizations", "Mobile Apps", "Development", "Graphics Design", "Illustrations", "UX / UI Design"] as const;
export type Category = (typeof categories)[number];

export type Post = { slug: string; title: string; date: string; category: Category; image: string; excerpt: string; body: string[] };

export const posts: Post[] = [
  { slug: "professional-digital-solutions", title: "Looking for Professional Digital Solutions Today?", date: "July - 16th 2026", category: "Development", image: "rectangle-21014", excerpt: "A good digital experience starts with a clear idea.", body: [
    "A good digital experience starts with a clear idea. We bring strategy, design, and development together to create websites that feel effortless to use and unmistakably yours.",
    "Start with the people you want to reach, define the story you want to tell, and give every detail a purpose. That clarity shapes everything that follows, from the structure of each page to the words on every button.",
    "When the foundations are right, the website becomes more than a brochure: it becomes the place where people get to know you, trust you and decide to work with you.",
  ] },
  { slug: "digital-solutions-for-growth", title: "Need Professional Digital Solutions For Growth?", date: "April - 22nd 2026", category: "SEO Optimizations", image: "rectangle-21013", excerpt: "Digital growth is built on understanding your customers.", body: [
    "Digital growth is built on understanding your customers. Thoughtful design connects a business with its audience, while a fast, accessible website gives that connection room to grow.",
    "Invest in clear communication, useful content, and a consistent brand experience across every touchpoint. Search engines and people reward the same things: pages that load quickly and answer real questions.",
    "Growth rarely comes from one big launch. It comes from steady improvements, measured honestly and made regularly.",
  ] },
  { slug: "brands-that-feel-simple", title: "Brands That Make Complex Things Feel Simple", date: "February - 22nd 2026", category: "UX / UI Design", image: "rectangle-21016", excerpt: "Consistency builds trust, from your identity to the smallest interaction.", body: [
    "The strongest brands make complex things feel simple. From your visual identity to your website’s smallest interaction, consistency builds trust.",
    "Considered digital design helps businesses turn attention into lasting relationships. Every screen should feel like it belongs to the same family, and every interaction should behave the way people expect.",
    "Simplicity takes work. It means making careful choices about what to leave out, so that what remains can do its job well.",
  ] },
  { slug: "affiliate-summit-europe", title: "Will you be attending Affiliate Summit Europe?", date: "February - 22th 2024", category: "SEO Optimizations", image: "pages/blog-1", excerpt: "What we are looking forward to at this year’s summit, and how to make the most of two busy days.", body: [
    "Affiliate Summit Europe brings together the people who connect brands with the audiences they are looking for. For a digital studio, it is a rare chance to hear first-hand what publishers, networks and advertisers need from the websites we build for them.",
    "This year we are paying close attention to search. Partner traffic only converts when the landing experience is fast, clear and trustworthy, and search engines increasingly reward the same qualities. Structured content, honest page titles and a lean front end do more than any single trick.",
    "If you are going, plan your sessions before you arrive, leave room for unplanned conversations, and write down one idea from every talk. The best results usually come from the smallest changes made the week after.",
  ] },
  { slug: "creative-direction-that-converts", title: "Creative direction that turns attention into action", date: "February - 18th 2024", category: "Graphics Design", image: "pages/blog-2", excerpt: "Bold visuals earn a second look. A clear message earns the click.", body: [
    "Striking imagery stops the scroll, but it is the message beside it that moves people to act. Good creative direction decides what a visitor should feel first and what they should do next.",
    "We start every campaign with a single sentence that describes the change we want to see. Colour, type and composition then follow that sentence rather than competing with it.",
    "The result is work that is memorable and useful at the same time: a visual identity people recognise and a path through the page they can follow without thinking.",
  ] },
  { slug: "launching-a-travel-brand-online", title: "Launching a premium travel brand online", date: "February - 12th 2024", category: "Development", image: "pages/blog-3", excerpt: "From first sketch to first booking: what a travel website really needs.", body: [
    "Travel is sold on feeling and bought on detail. A premium travel website has to deliver both: imagery that makes people want to go and practical information that lets them book with confidence.",
    "We built the experience around fast, responsive pages, clear pricing and a booking flow with as few steps as possible. Every image is sized for the screen it appears on so the site stays quick on mobile networks.",
    "Since launch, more visitors reach the enquiry form and fewer leave halfway through. The lesson is simple: beautiful and fast are not opposites.",
  ] },
  { slug: "running-better-workshops", title: "How we run discovery workshops with clients", date: "February - 05th 2024", category: "UX / UI Design", image: "pages/blog-4", excerpt: "The questions we ask before we design a single screen.", body: [
    "A discovery workshop is the most valuable hour of any project. It is where assumptions are tested, goals are agreed and the people who will use the product finally get a voice.",
    "We keep our workshops short and practical: who are we designing for, what are they trying to do, and what is stopping them today? Everything we learn becomes the brief for the first prototype.",
    "Clients often tell us the workshop alone changed how their team talks about the product. That shared language makes every decision afterwards faster.",
  ] },
  { slug: "designing-calm-workspaces", title: "Designing calm digital workspaces", date: "January - 28th 2024", category: "Mobile Apps", image: "pages/blog-5", excerpt: "Fewer distractions, clearer priorities, better work.", body: [
    "Busy interfaces make busy minds. When we design dashboards and internal tools, our first job is to remove anything that does not help someone finish their task.",
    "Calm design relies on clear hierarchy, generous spacing and predictable patterns. Notifications earn their place, and the most important action on each screen is obvious at a glance.",
    "On mobile the same principles matter even more: small screens leave no room for clutter, and every tap should feel deliberate.",
  ] },
  { slug: "brand-identity-for-growing-teams", title: "Brand identity for growing teams", date: "January - 20th 2024", category: "Illustrations", image: "pages/blog-6", excerpt: "A brand system that stays consistent as more people use it.", body: [
    "As a business grows, more people start creating on behalf of the brand. Without a shared system, consistency quietly slips away.",
    "We design identities as toolkits: a logo, colours and type, but also illustration styles, photography direction and templates that anyone on the team can use with confidence.",
    "A strong system frees people to create rather than restricting them, and it keeps every touchpoint recognisably yours.",
  ] },
];


export type Work = { slug: string; image: string; title: string; category: string; description: string };

export const works: Work[] = [
  { slug: "concrete-planters", image: "image-205", title: "CLASSIC CONCRETE PLANTERS", category: "Travel & Tourism", description: "A fresh perspective on the everyday. A visual exploration of organic growth, texture, and the beauty of simple objects." },
  { slug: "travel-brand-website", image: "project-laptop", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "A travel brand brought online. A clear, welcoming website that turns curious visitors into confident bookings." },
  { slug: "time-and-transformation", image: "image-208", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "A cinematic study of time and transformation. Bold digital imagery brings a new dimension to an editorial story." },
  { slug: "past-meets-future", image: "image-207", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "Past and future meet in a surreal visual world. An expressive campaign built around craft, curiosity, and unexpected ideas." },
  { slug: "virtual-reality-campaign", image: "pages/work-1", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "An immersive campaign exploring virtual reality and the people who live in it." },
  { slug: "digital-portrait-series", image: "pages/work-2", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "A digital portrait series where human features meet circuitry and light." },
  { slug: "thinking-machine", image: "pages/work-3", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "Key art for a technology brand, built around the idea of a thinking machine." },
  { slug: "professional-services", image: "pages/work-4", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "Corporate photography and art direction for a professional services firm." },
  { slug: "modern-workspace", image: "pages/work-5", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "Interior photography for a modern workspace and meeting suite." },
  { slug: "bright-ideas", image: "pages/work-6", title: "CLASSIC CONCRETE PLANTERS", category: "Brand , Photography", description: "A colourful creative concept celebrating bright ideas and imagination." },
];
