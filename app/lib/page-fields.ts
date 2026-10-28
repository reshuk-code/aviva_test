// Every editable part of the fixed pages. The admin builds its page editors from this list,
// and the site falls back to these defaults for anything that hasn't been edited yet.

export type ImageValue = { src: string; alt: string };
export type FieldType = "text" | "textarea" | "richtext" | "image" | "list";
export type Field = { key: string; label: string; type: FieldType; help?: string; item?: Field[]; itemLabel?: string };
export type PageSection = { title: string; fields: Field[] };
export type PageDefinition = { key: string; title: string; path: string; description: string; sections: PageSection[]; defaults: Record<string, unknown>; seo: { title: string; description: string } };

const text = (key: string, label: string, help?: string): Field => ({ key, label, type: "text", help });
const area = (key: string, label: string, help?: string): Field => ({ key, label, type: "textarea", help });
const image = (key: string, label: string, help?: string): Field => ({ key, label, type: "image", help });
const list = (key: string, label: string, itemLabel: string, item: Field[], help?: string): Field => ({ key, label, type: "list", itemLabel, item, help });
const rich = (key: string, label: string, help?: string): Field => ({ key, label, type: "richtext", help });
const faqs = (key: string, label: string) => list(key, label, "Question", [text("question", "Question"), rich("answer", "Answer")]);
const banner = (title: string, src: string): [PageSection, Record<string, unknown>] => [
  { title: "Banner", fields: [text("bannerTitle", "Page title"), image("bannerImage", "Banner image")] },
  { bannerTitle: title, bannerImage: { src, alt: "" } },
];
const lineBreaks = "Press Enter to start a new line where the design breaks the heading.";

const [servicesBanner, servicesBannerDefaults] = banner("Service", "/images/pages/service-1.webp");
const [aboutBanner, aboutBannerDefaults] = banner("About", "/images/pages/about-banner.webp");
const [contactBanner, contactBannerDefaults] = banner("Contact Us", "/images/image-192.webp");
const [blogBanner, blogBannerDefaults] = banner("Blog", "/images/studio-team.jpg");
const [portfolioBanner, portfolioBannerDefaults] = banner("Portfolio", "/images/creative-studio-v2.webp");

const sameText = "We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers.";

export const pageDefinitions: PageDefinition[] = [
  {
    key: "home", title: "Home", path: "/", description: "Hero, about, process, why us, numbers and section headings.",
    seo: { title: "Aviva — Website Development Company in Nepal", description: "Aviva is a professional web design and development company in Kathmandu, building modern websites, brands and digital campaigns since 2007." },
    sections: [
      { title: "Hero", fields: [text("heroLead", "Small line above the heading"), text("heroLine1", "Heading line 1"), text("heroLine2", "Heading line 2 (outlined)"), text("heroLine3", "Heading line 3"), image("heroImage", "Office photo"), area("heroNote1", "Note, first paragraph"), area("heroNote2", "Note, second paragraph"), text("heroName", "Person name"), text("heroRole", "Person role"), text("heroWhatsapp", "WhatsApp number", "Digits only, with or without the country code.")] },
      { title: "Scrolling words", fields: [text("marqueeSolid", "Solid words"), text("marqueeOutline", "Outlined words")] },
      { title: "Experience badge", fields: [text("experienceYears", "Years of experience", "A number, shown as “17+”.")] },
      { title: "About", fields: [text("aboutLabel", "Small label"), area("aboutHeading", "Heading", lineBreaks), area("aboutLead", "Lead paragraph"), area("aboutText", "Paragraph"), text("aboutLink", "Link text")] },
      { title: "Services", fields: [text("servicesHeading1", "Heading line 1"), text("servicesHeading2", "Heading line 2")], },
      { title: "Portfolio", fields: [text("projectsLabel", "Small label"), text("projectsHeading", "Heading"), text("projectsLink", "Link text")] },
      { title: "How we work", fields: [text("processLabel", "Small label"), text("processHeading", "Heading"), list("steps", "Steps", "Step", [text("title", "Title"), area("text", "Text")], "The design has room for three steps.")] },
      { title: "Why us", fields: [image("whyImage", "Portrait"), text("whyLabel", "Small label"), area("whyHeading", "Heading", lineBreaks), text("whyHighlight", "Highlighted words"), area("whyLead", "Lead paragraph"), area("whyText", "Paragraph"), list("benefits", "Ticked benefits", "Benefit", [text("text", "Benefit")]), text("whyButton", "Button text")] },
      { title: "Numbers", fields: [list("stats", "Numbers", "Number", [text("value", "Number"), text("label", "Label")])] },
      { title: "Skills", fields: [text("skillsHeading", "Heading"), area("skillsIntro", "Paragraph"), text("skillsLink", "Link text")] },
      { title: "Blog", fields: [text("blogLabel", "Small label"), text("blogHeading", "Heading"), text("blogLink", "Link text")] },
    ],
    defaults: {
      heroLead: "Nepal’s professional & leading", heroLine1: "WEBSITE", heroLine2: "DEVELOPMENT", heroLine3: "COMPANY",
      heroImage: { src: "/images/aviva-office.webp", alt: "A creative team collaborating on a website in a bright, modern studio" },
      heroNote1: "We create modern websites with creative designs, smooth performance, and simple user experiences for growing businesses.",
      heroNote2: "From design to development, we help growing businesses create a clear, confident presence online.",
      heroName: "Roshan Bhattarai", heroRole: "Managing Director", heroWhatsapp: "9851001237",
      marqueeSolid: "DESIGN  WEB DESIGN", marqueeOutline: "COPYWRITING", experienceYears: "17",
      aboutLabel: "About company", aboutHeading: "Creative Web Solutions for\nModern Businesses",
      aboutLead: "We create modern digital solutions with creative design, smart technology, and seamless functionality to help businesses grow online.",
      aboutText: `${sameText} ${sameText}`, aboutLink: "READ MORE +",
      servicesHeading1: "Unique Ideas", servicesHeading2: "For Your Business.",
      projectsLabel: "Portfolio", projectsHeading: "Explore some of our recent works", projectsLink: "See all projects",
      processLabel: "How we work", processHeading: "3 easy steps for your",
      steps: [{ title: "Planning & Strategy", text: sameText }, { title: "Design & Develop", text: sameText }, { title: "Test & Deliver", text: sameText }],
      whyImage: { src: "/images/aviva-portrait.webp", alt: "A smiling creative professional pointing toward Aviva's services" },
      whyLabel: "Why us", whyHeading: "Top reason most company\nchoose", whyHighlight: "Aviva Web Technology",
      whyLead: "There are many experienced engineers for your it solution services that give awesome solutions.",
      whyText: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock.",
      benefits: [{ text: "Product Engineering" }, { text: "Digital Services" }, { text: "Automated Software" }, { text: "Excellent 24/7 Support available" }],
      whyButton: "Discover More",
      stats: [{ value: "17+", label: "Years of experience" }, { value: "500+", label: "Project completed" }, { value: "399+", label: "Happy customers" }],
      skillsHeading: "The skills behind the work", skillsIntro: "A blend of creativity, strategy, and technical skill—crafted through experience to deliver results A blend ofted through experience to deliver results", skillsLink: "View profile",
      blogLabel: "Blogs & news", blogHeading: "Our Latest News & Blog Posts", blogLink: "More Blog Posts",
    },
  },
  {
    key: "services-overview", title: "Services", path: "/services", description: "The services overview page: intro, services card and reasons to choose Aviva.",
    seo: { title: "Services — Aviva", description: "Web design, development, branding and digital marketing services from Aviva, a creative web studio in Kathmandu." },
    sections: [
      servicesBanner,
      { title: "Intro", fields: [image("introImage", "Photo"), text("cardBold", "Card text (bold part)"), text("cardText", "Card text (regular part)"), text("introLabel", "Small label"), area("introHeading", "Heading", lineBreaks), area("introText", "Text", "Leave an empty line between paragraphs.")] },
      { title: "Services card", fields: [text("servicesHeading1", "Heading line 1"), text("servicesHeading2", "Heading line 2"), image("filmImage", "Background photo", "Shown behind the card. The services themselves are edited under Services.")] },
      { title: "Why choose us", fields: [text("whyLabel", "Small label"), area("whyHeading", "Heading", lineBreaks), list("reasons", "Reasons", "Reason", [text("title", "Title"), area("text", "Text")]), image("whyImage", "Hexagon image")] },
    ],
    defaults: {
      ...servicesBannerDefaults,
      introImage: { src: "/images/pages/service-intro.webp", alt: "Two colleagues reviewing a website plan together" },
      cardBold: "Web Solutions Research", cardText: "and Idea Generate",
      introLabel: "What we do", introHeading: "Web Design Built\nAround Your Business",
      introText: "We are a creative web studio in Kathmandu, designing and building websites, brands and digital campaigns for businesses since 2007.\n\nEvery project starts with research into your business and your customers, so the ideas we bring are grounded in what will actually work for you.",
      servicesHeading1: "Unique Ideas", servicesHeading2: "For Your Business.",
      filmImage: { src: "/images/studio-meeting.jpg", alt: "The Aviva team working together on laptops" },
      whyLabel: "Why choose us", whyHeading: "Web Design Company\nThat You Can Trust",
      reasons: [
        { title: "Develop new products", text: "We plan, design and build new websites and digital products around your goals." },
        { title: "Get in touch, think ahead", text: "Clear communication from the first call, with a plan for where your site goes next." },
        { title: "Design that converts", text: "Layouts and content shaped to turn visitors into enquiries and customers." },
        { title: "Data & analytics", text: "We measure what matters and use the numbers to keep improving your site." },
      ],
      whyImage: { src: "/images/pages/about-hex.webp", alt: "Two colleagues reviewing documents, framed by a lightning bolt" },
    },
  },
  {
    key: "about", title: "About", path: "/about", description: "Company introduction, numbers and reasons to choose Aviva.",
    seo: { title: "About — Aviva", description: "Aviva is a creative web design and development studio in Kathmandu, building modern websites since 2007." },
    sections: [aboutBanner,
      { title: "Introduction", fields: [text("introLabel", "Small label"), text("introHeading", "Heading"), area("introQuote", "Quote"), list("stats", "Numbers", "Number", [text("value", "Number"), text("label", "Label")], "The design has room for two."), image("introImage", "Hexagon photo")] },
      { title: "Why choose us", fields: [text("yearsBadge", "Years badge number"), text("whyLabel", "Small label"), area("whyHeading", "Heading", lineBreaks), list("reasons", "Reasons", "Reason", [text("title", "Title"), area("text", "Text")])] },
    ],
    defaults: { ...aboutBannerDefaults,
      introLabel: "About company", introHeading: "Best Creative & Modern Agency",
      introQuote: "We are a Kathmandu web studio that turns ideas into fast, beautiful websites. Strategy, design and development live under one roof, so every project feels considered from the first sketch to launch day.",
      stats: [{ value: "10", label: "Expert team members" }, { value: "17+", label: "Years of experience" }],
      introImage: { src: "/images/pages/about-hex.webp", alt: "Two colleagues reviewing a project in a bright office" },
      yearsBadge: "17", whyLabel: "Why choose us?", whyHeading: "Web Design Company\nThat You Can Trust",
      reasons: [
        { title: "Develop New Production", text: "We plan, design and build every website around the goals of your business." },
        { title: "Get in Touch Think Way Ahead", text: "Reach out and let’s think a step ahead together, from launch to growth." },
        { title: "Initiate New Production", text: "Clear timelines, regular updates and a team you can always talk to." },
        { title: "Data & Analytics", text: "We measure what matters and keep improving your site after launch." },
      ],
    },
  },
  {
    key: "contact", title: "Contact", path: "/contact", description: "Contact page headings. Addresses and numbers live in Settings.",
    seo: { title: "Contact — Aviva", description: "Talk to Aviva about your next website, brand or campaign." },
    sections: [contactBanner, { title: "Content", fields: [text("label", "Small label"), text("heading1", "Heading line 1"), text("heading2", "Heading line 2"), text("mapLabel", "Map label")] }],
    defaults: { ...contactBannerDefaults, label: "Get in touch", heading1: "Ready to Work", heading2: "Your Next Projects", mapLabel: "Find us" },
  },
  {
    key: "blog", title: "Blog", path: "/blog", description: "Blog listing banner. Posts are edited under Blog posts.",
    seo: { title: "Blog — Aviva", description: "Ideas, process notes and news from the Aviva studio." },
    sections: [blogBanner], defaults: { ...blogBannerDefaults },
  },
  {
    key: "portfolio", title: "Portfolio", path: "/portfolio", description: "Portfolio listing and project page banners.",
    seo: { title: "Portfolio — Aviva", description: "Selected websites, brands and campaigns by Aviva." },
    sections: [portfolioBanner, { title: "Project pages", fields: [image("detailBanner", "Banner on each project page"), text("ctaText", "Button text on project pages")] }],
    defaults: { ...portfolioBannerDefaults, detailBanner: { src: "/images/creative-studio-v2.webp", alt: "" }, ctaText: "Start a similar project" },
  },
  {
    key: "services", title: "Service pages", path: "/services/web-design-development", description: "Parts shared by every service page: contact card and the “Why choose us” questions.",
    seo: { title: "", description: "" },
    sections: [
      { title: "Questions", fields: [text("faqHeading", "Questions heading", "{service} is replaced by the service name.")] },
      { title: "Contact card", fields: [image("supportImage", "Photo"), text("supportPhone", "Phone number")] },
      { title: "Why choose us", fields: [text("whyLabel", "Small label"), text("whyHeading", "Heading"), faqs("whyFaqs", "Questions"), image("boltImage", "Lightning bolt image")] },
    ],
    defaults: {
      faqHeading: "Have Any Questions About {service}?",
      supportImage: { src: "/images/pages/service-contact.webp", alt: "" }, supportPhone: "+977 9851001237",
      whyLabel: "Why choose us", whyHeading: "Frequently Asked Questions", boltImage: { src: "/images/pages/service-bolt.webp", alt: "" },
      whyFaqs: [
        { question: "Will you provide a website layout before design starts?", answer: "Yes. We share wireframes and a layout of each key page first, so you can agree the structure before we move into detailed design." },
        { question: "Do I own my website when it’s finished?", answer: "Yes. Once the project is complete, the design, content and code are yours, and we hand over all the accounts and access." },
        { question: "Can I update the content myself?", answer: "Every site comes with an easy editing system and a short training session, so your team can update text, images and posts." },
        { question: "What do you need from me to get started?", answer: "A short brief, your logo and brand materials if you have them, and examples of websites you like. We’ll guide you through the rest." },
      ],
    },
  },
  {
    key: "not-found", title: "404 page", path: "/page-not-found-example", description: "What visitors see when a link is broken.",
    seo: { title: "Page not found — Aviva", description: "" },
    sections: [{ title: "Content", fields: [text("big", "Big word"), text("heading", "Heading"), text("text", "Text"), text("button", "Button text"), image("illustration", "Illustration")] }],
    defaults: { big: "OOPS!", heading: "This Page Can’t Be Found", text: "The link may be broken, or the page may have moved.", button: "Go To Home", illustration: { src: "/images/pages/404-illustration.webp", alt: "A puzzled man at his desk beside a 404 sign" } },
  },
];

export const pageDefinition = (key: string) => pageDefinitions.find((page) => page.key === key);
