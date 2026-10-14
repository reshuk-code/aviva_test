// Starting service pages for a fresh database (see db-setup.mts). After setup, edit them in /admin.

type Faq = { question: string; answer: string };

const generalFaqs: Faq[] = [
  { question: "How can I start a website development project?", answer: "Send us a quote request or a message with a few details about your business and goals. We’ll set up a short call, agree on the scope and send you a clear proposal with timelines and pricing." },
  { question: "Do you develop responsive and mobile-friendly websites?", answer: "Yes. Every site we build is designed and tested for phones, tablets and desktops, and optimised to load quickly on mobile networks." },
  { question: "What industries do you serve?", answer: "We work with travel and tourism, hospitality, education, healthcare, retail, NGOs and professional services, from start-ups to established organisations." },
  { question: "Do you provide website maintenance and support?", answer: "Yes. We offer ongoing support plans that cover security updates, backups, content changes and performance monitoring." },
  { question: "How do you measure project success?", answer: "We agree on goals at the start, such as enquiries, bookings or sales, and track them with analytics after launch so we can keep improving." },
];

export type Service = { slug: string; title: string; summary: string; introHeading: string; intro: string; bodyHeading: string; body: string; highlights: string[]; image: string; faqs: Faq[] };

export const services: Service[] = [
  { slug: "web-design-development", title: "Web Design & Development", summary: "Web Design & Development involves creating visually appealing and highly functional websites.", image: "studio-meeting.jpg",
    introHeading: "Web Technology Services", intro: "We provide professional web technology solutions to help businesses build a strong online presence. Our team specializes in website design, web development, custom software, and digital solutions tailored to your business needs. We combine modern technology, creative design, and reliable functionality to deliver effective digital experiences that help your business grow.",
    bodyHeading: "Reliable Digital Solutions for Every Business", body: "Need a new website or want to improve your existing platform? Is your business ready for a digital upgrade? We create professional websites and customized technology solutions designed to improve performance and simplify everyday operations. Our services combine creative ideas with technical expertise to deliver dependable results. From business websites to advanced web applications, we turn your ideas into practical digital solutions that support your business growth.",
    highlights: ["We provide ongoing technical support to keep your digital platforms secure and updated.", "Our solutions help improve business efficiency and strengthen your online presence.", "Every website is responsive, fast and built to be easy for your team to update."],
    faqs: [{ question: "What services does your web technology company provide?", answer: "We provide professional website design, web development, custom software, e-commerce solutions, and digital services to help businesses improve their online presence." }, ...generalFaqs] },
  { slug: "marketing-campaigns", title: "Advertising and Marketing Campaigns", summary: "Advertising and marketing campaigns craft targeted messages to boost brand visibility and engagement", image: "aviva-office.webp",
    introHeading: "Campaigns That Reach the Right People", intro: "We plan and produce digital campaigns that put your brand in front of the people most likely to buy. From social media and search ads to landing pages and creative assets, every part of the campaign works towards one clear goal.",
    bodyHeading: "Measured, Creative and Built to Convert", body: "Good campaigns start with a sharp message and a clear audience. We combine strategy, design and copywriting with careful tracking, so you can see exactly what each campaign delivers and where to invest next.",
    highlights: ["Campaign strategy, creative and landing pages from one team.", "Clear reporting on reach, enquiries and return on spend.", "Ongoing optimisation based on real results."],
    faqs: [{ question: "Which advertising channels do you work with?", answer: "We run campaigns on Google, Facebook, Instagram, TikTok and LinkedIn, and recommend the mix that suits your audience and budget." }, ...generalFaqs] },
  { slug: "creative-consulting", title: "Creative Consulting and Development", summary: "Creative consulting and development provide innovative to enhance brand identity and growth.", image: "studio-team.jpg",
    introHeading: "Ideas Shaped Into Clear Plans", intro: "Not sure where to start? Our creative consulting helps you turn ambitions into a practical digital plan. We look at your brand, your customers and your competitors, then recommend the projects that will make the biggest difference.",
    bodyHeading: "From Workshop to Launch", body: "We run focused discovery workshops, map out user journeys and prototype ideas before anything is built. That way every decision is tested early and your budget goes where it matters most.",
    highlights: ["Discovery workshops with your team and customers.", "Roadmaps, prototypes and content strategy.", "Hands-on support through design and development."],
    faqs: [{ question: "What happens in a discovery workshop?", answer: "We spend a focused session with your team agreeing goals, audiences and priorities. You leave with a shared brief and a clear list of next steps." }, ...generalFaqs] },
  { slug: "branding-identity", title: "Branding and Identity Design", summary: "Branding and identity design create a cohesive visual identity that defines and differentiates brands.", image: "creative-studio-v2.webp",
    introHeading: "A Brand People Remember", intro: "Your brand is how people recognise and remember you. We design logos, colour palettes, typography and visual systems that express who you are and stay consistent everywhere your business appears.",
    bodyHeading: "Identity Systems That Grow With You", body: "We build brand toolkits rather than one-off logos: guidelines, templates and assets your team can use with confidence across your website, social media, print and signage.",
    highlights: ["Logo design, colour, typography and brand guidelines.", "Social media, print and presentation templates.", "Brand refreshes that keep the equity you have built."],
    faqs: [{ question: "Can you refresh our existing brand rather than start again?", answer: "Yes. Many projects modernise an existing identity while keeping the recognition you have already earned." }, ...generalFaqs] },
  { slug: "custom-software-development", title: "Custom Software Development", summary: "Custom software and web applications built around the way your business works.", image: "studio-meeting.jpg",
    introHeading: "Software Built Around Your Business", intro: "When off-the-shelf tools don’t fit, we build custom web applications, dashboards and integrations that match the way your team actually works.",
    bodyHeading: "Reliable, Secure and Easy to Use", body: "From booking systems to internal tools and customer portals, we design clear interfaces and build dependable systems that save time and reduce manual work.",
    highlights: ["Web applications, portals and admin dashboards.", "Integrations with payment gateways and third-party services.", "Secure hosting, backups and long-term support."],
    faqs: [{ question: "How long does a custom software project take?", answer: "Most projects take between six and sixteen weeks depending on scope. We deliver in stages so you can start using key features early." }, ...generalFaqs] },
  { slug: "wordpress-development", title: "WordPress Development", summary: "Fast, secure WordPress websites your team can update with ease.", image: "aviva-office.webp",
    introHeading: "WordPress Websites Done Properly", intro: "WordPress powers a large part of the web. We build custom WordPress themes and plugins that are fast, secure and simple for your team to manage.",
    bodyHeading: "Easy to Edit, Built to Last", body: "No bloated page builders or fragile plugins: we create clean, well-structured WordPress sites with editing tools tailored to your content, plus care plans to keep everything up to date.",
    highlights: ["Custom themes designed for your brand.", "Speed, security and SEO best practice built in.", "Training and ongoing maintenance plans."],
    faqs: [{ question: "Can you take over and improve our existing WordPress site?", answer: "Yes. We audit the current site, fix performance and security issues, and improve the design and editing experience." }, ...generalFaqs] },
  { slug: "ecommerce-development", title: "E-commerce Development", summary: "Online stores that make buying simple and keep customers coming back.", image: "studio-team.jpg",
    introHeading: "Online Stores That Sell", intro: "We design and build online stores that make it easy for customers to find products, trust your brand and complete their purchase.",
    bodyHeading: "From Product Pages to Payment", body: "We handle catalogue setup, local and international payment gateways, delivery options and order management, with a checkout designed to convert on every device.",
    highlights: ["Local payment gateways such as eSewa and Khalti, plus cards.", "Inventory, order and customer management.", "Fast product pages optimised for search."],
    faqs: [{ question: "Which payment methods can my store accept?", answer: "We integrate local wallets such as eSewa and Khalti, bank transfers and international cards, depending on where your customers are." }, ...generalFaqs] },
  { slug: "seo-services", title: "SEO Services", summary: "Search optimisation that brings the right visitors to your website.", image: "creative-studio-v2.webp",
    introHeading: "Be Found When It Matters", intro: "Search engine optimisation helps customers find you at the moment they are looking. We improve your website’s structure, speed and content so it ranks for the searches that bring real business.",
    bodyHeading: "Technical, Content and Local SEO", body: "We fix technical issues, research the keywords your customers use, improve your pages and build your local presence, then report clearly on rankings, traffic and enquiries.",
    highlights: ["Technical audits and site speed improvements.", "Keyword research and content optimisation.", "Google Business Profile and local search."],
    faqs: [{ question: "How long does SEO take to show results?", answer: "Most sites see meaningful improvements within three to six months. Technical fixes can help sooner, while content and authority build over time." }, ...generalFaqs] },
];

/** The dark "Why choose us" questions shown on every service page. */
export const whyFaqs: Faq[] = [
  { question: "Will you provide a website layout before design starts?", answer: "Yes. We share wireframes and a layout of each key page first, so you can agree the structure before we move into detailed design." },
  { question: "Do I own my website when it’s finished?", answer: "Yes. Once the project is complete, the design, content and code are yours, and we hand over all the accounts and access." },
  { question: "Can I update the content myself?", answer: "Every site comes with an easy editing system and a short training session, so your team can update text, images and posts." },
  { question: "What do you need from me to get started?", answer: "A short brief, your logo and brand materials if you have them, and examples of websites you like. We’ll guide you through the rest." },
];
