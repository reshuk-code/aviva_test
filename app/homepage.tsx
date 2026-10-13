import Image from "next/image";
import { Arrow, Art, Logo, SocialLinks } from "./components/design";
import { BlogCard, Header, HeroControls, DropList, ProjectCard, Reveal, RollingLink, ScrollEffects } from "./components/interactive";
import s from "./home.module.css";
import { HeroSculpture } from "./components/hero-sculpture";
import { ContourParticles } from "./components/contour-particles";
import { CountUp } from "./components/count-up";
import { OrbitDecoration } from "./components/orbit-decoration";

import { HeaderWave } from "./components/header-wave";
import { QuoteWizard } from "./components/quote-wizard";

const email = "avivanepal@example.com";
const services = [
  { title: "Web Design & Development", description: "Web Design & Development involves creating visually appealing and highly functional websites." },
  { title: "Advertising and Marketing Campaigns", description: "Advertising and marketing campaigns craft targeted messages to boost brand visibility and engagement" },
  { title: "Creative Consulting and Development", description: "Creative consulting and development provide innovative to enhance brand identity and growth." },
  { title: "Branding and Identity Design", description: "Branding and identity design create a cohesive visual identity that defines and differentiates brands." },
];
const projects = [
  { image: "image-205", title: "CLASSIC CONCRETE PLANTERS", category: "Travel & Tourism", description: "A fresh perspective on the everyday. A visual exploration of organic growth, texture, and the beauty of simple objects." },
  { image: "project-laptop", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "A travel brand brought online. A clear, welcoming website that turns curious visitors into confident bookings." },
  { image: "image-208", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "A cinematic study of time and transformation. Bold digital imagery brings a new dimension to an editorial story." },
  { image: "image-207", title: "CLASSIC CONCRETE PLANTERS", category: "Brand, Photography", description: "Past and future meet in a surreal visual world. An expressive campaign built around craft, curiosity, and unexpected ideas." },
];
const articles = [
  { image: "rectangle-21014", date: "July - 16th 2026", title: "Looking for Professional Digital Solutions Today?", text: "A good digital experience starts with a clear idea. We bring strategy, design, and development together to create websites that feel effortless to use and unmistakably yours. Start with the people you want to reach, define the story you want to tell, and give every detail a purpose." },
  { image: "rectangle-21013", date: "April - 22nd 2026", title: "Need Professional Digital Solutions For Growth?", text: "Digital growth is built on understanding your customers. Thoughtful design connects a business with its audience, while a fast, accessible website gives that connection room to grow. Invest in clear communication, useful content, and a consistent brand experience across every touchpoint." },
  { image: "rectangle-21016", date: "February - 22nd 2026", title: "Need Professional Digital Solutions For Growth?", text: "The strongest brands make complex things feel simple. From your visual identity to your website's smallest interaction, consistency builds trust. Considered digital design helps businesses turn attention into lasting relationships." },
];
const steps = [
  { title: "Planning & Strategy", icon: "vector-2", text: "We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers." },
  { title: "Design & Develop", icon: "vector-3", text: "We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers." },
  { title: "Test & Deliver", icon: "vector-4", text: "We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers." },
];
// x/y place the pills of the upper, scattered row as a share of the row width and in design units.
const skills: { name: string; icon: string; x?: number; y?: number; tilted?: boolean }[] = [
  { name: "Sketch", icon: "sketch" },
  { name: "JavaScript (ES6+)", icon: "javascript" },
  { name: "Flutter", icon: "flutter" },
  { name: "Supabase", icon: "supabase" },
  { name: "Vitejs", icon: "vite" },
  { name: "Python (Django)", icon: "django" },
  { name: "Tailwindcss & CSS3", icon: "tailwindcss" },
  { name: "Wordpress", icon: "wordpress", x: 17.3, y: 77 },
  { name: "Reactjs", icon: "react", x: 30.8, y: 88, tilted: true },
  { name: "Figma", icon: "figma", x: 45.2, y: 55, tilted: true },
  { name: "Python", icon: "python", x: 53.4, y: 48, tilted: true },
  { name: "Sveltejs", icon: "svelte", x: 60.5, y: 45, tilted: true },
  { name: "Nuxtjs", icon: "nuxt", x: 67.3, y: 50, tilted: true },
  { name: "Nextjs", icon: "nextdotjs", x: 75.4, y: 77 },
  { name: "WebFlow", icon: "webflow", x: 86.9, y: 77 },
];

// Brand colour of each skill icon, used for the pill's hover glow.
const skillColors: Record<string, string> = { sketch: "#f7b500", javascript: "#f7df1e", flutter: "#4fb3f6", supabase: "#3fcf8e", vite: "#8b91ff", django: "#44b78b", tailwindcss: "#06b6d4", wordpress: "#4aa3d0", react: "#61dafb", figma: "#f24e1e", python: "#5a9fd4", svelte: "#ff3e00", nuxt: "#00dc82", nextdotjs: "#ffffff", webflow: "#4f8dff" };

function Label({ children }: { children: React.ReactNode }) {
  return <p className={s.label}>{children}<Arrow /></p>;
}

export default function Home() {
  return <main id="home" className={`${s.page} site-shell`}>
    <HeaderWave />
    <ScrollEffects />
    <a href="#about" className="skip-link">Skip to content</a>
    <Header />
    <QuoteWizard />

    <section className={s.hero} aria-labelledby="hero-heading">
      <div className={s.heroCopy}><p className={s.heroLead}>Nepal’s professional & leading</p><h1 id="hero-heading"><span>WEBSITE</span><span className={s.outline}>DEVELOPMENT</span><span className={s.company}>COMPANY</span></h1></div>
      <Art name="image-1" className={`${s.heroDashes} ambient-motion`} />
      <HeroSculpture className={s.heroArtwork} />
      <div className={`${s.heroOffice} hero-office`}><Image src="/images/aviva-office.webp" alt="A creative team collaborating on a website in a bright, modern studio" fill sizes="(max-width: 700px) 100vw, 65vw" preload className="object-cover" /><HeroControls /></div>
      <div className={s.heroNote}><Art name="image-189" className={s.signature} /><p>We create modern websites with creative designs, smooth performance, and simple user experiences for growing businesses.</p><p>From design to development, we help growing businesses create a clear, confident presence online.</p><div className={s.heroAuthor}><Art name="ellipse-330" className={s.heroAvatar} alt="Aviva managing director" /><div><strong>Roshan Bhattarai</strong><span>Managing Director</span></div><a href="https://wa.me/9779851001237" target="_blank" rel="noreferrer" aria-label="WhatsApp Roshan Bhattarai at 9851001237"><svg className={s.authorWhatsapp} viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Z"/><path fill="#fff" d="M8.1 6.6c-.3 0-.6.1-.8.4-.4.4-1 1-1 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.2.1 1.7.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-.9 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.8Z"/></svg>9851001237</a></div></div>
    </section>

    <section className={`${s.marquee} marquee`} aria-label="Design, web design, and copywriting"><div className={`${s.marqueeTrack} marquee-track`} aria-hidden="true"><span>DESIGN&nbsp; WEB DESIGN&nbsp; </span><span>DESIGN&nbsp; WEB DESIGN&nbsp; </span></div><div className={`${s.marqueeOutline} marquee-outline`} aria-hidden="true"><span>COPYWRITING&nbsp; COPYWRITING&nbsp; </span></div></section>

    <Reveal><section className={s.collage} aria-label="17+ years of creative experience"><div className={s.collageLeft}><Art name="image-192" className={`${s.eye} cursor-photo`} alt="An expressive eye surrounded by vivid orange and blue paint" /><div className={s.experience}><CountUp value={17} suffix="+" /><div><span>YEARS</span><b>EXPERIENCE</b></div></div></div><Art name="image-193" className={`${s.collageWoman} cursor-photo`} alt="An artistic portrait framed by a collage of leaves and paper" /><div className={s.collageRight}><div className={s.stars}><Art name="image-194" className={`${s.outlineStar} ambient-motion`} /><Art name="image-195" className={`${s.goldStar} ambient-motion`} /></div><Art name="image-196" className={`${s.future} cursor-photo`} alt="A futuristic portrait with a translucent neon visor" /></div></section></Reveal>

    <section id="about" className={s.about} aria-labelledby="about-heading"><ContourParticles className={s.aboutPrint} shape="terrain" /><OrbitDecoration className={s.aboutScribble} /><Reveal className={s.aboutCopy}><Label>About company</Label><h2 id="about-heading">Creative Web Solutions for<br />Modern Businesses</h2><p className={s.aboutLead}>We create modern digital solutions with creative design, smart technology, and seamless functionality to help businesses grow online.</p><p>We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers. We build professional, responsive websites with user-friendly designs and powerful features that strengthen your online presence and connect you with customers.</p><a href="#services" className={s.readMore}>READ MORE +</a></Reveal></section>

    <Reveal><section id="services" className={`${s.services} ${s.container}`} aria-labelledby="services-heading"><ContourParticles className={s.serviceRing} shape="ring" /><ContourParticles className={s.servicesPrint} shape="terrain" /><h2 id="services-heading">Unique Ideas<br /><span><a href={`mailto:${email}`} className={s.goldCircle} aria-label="Discuss an idea"><Arrow /></a>For Your Business.</span></h2><div className={s.servicesGrid}>{services.map((service,index) => <a href={`mailto:${email}?subject=${encodeURIComponent(service.title)}`} className={s.service} key={service.title}><h3>{service.title}</h3><p>{service.description}</p><div className={s.serviceBottom}><span className={s.serviceArrow}><Arrow /></span><span className={s.serviceNumber}>0{index+1}</span></div></a>)}</div></section></Reveal>

    <section id="projects" className={`${s.projects} ${s.container}`} aria-labelledby="projects-heading"><Reveal><Label>Portfolio</Label><h2 id="projects-heading">Explore some of our recent works</h2></Reveal><div className={s.projectGrid}>{projects.map((project) => <Reveal key={project.image}><ProjectCard project={project} /></Reveal>)}</div><div className={s.center}><a href={`mailto:${email}?subject=Let%E2%80%99s%20talk%20about%20a%20project`} className={s.textLink}>See all projects<Arrow /></a></div></section>

    <Reveal><section id="process" className={s.process} aria-labelledby="process-heading"><ContourParticles className={s.processPrintLeft} shape="ring" /><ContourParticles className={s.processPrintRight} shape="terrain" /><div className={s.center}><Label>How we work</Label><h2 id="process-heading">3 easy steps for your</h2></div><div className={s.processGrid}>{steps.map((step) => <article key={step.title} className={s.step}><span className={s.stepIcon}><Art name={step.icon} /></span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section></Reveal>

    <section id="why-us" className={`${s.whyUs} ${s.container}`} aria-labelledby="why-heading"><div className={`${s.whyPortrait} cursor-portrait`}><div className={s.portraitShape} /><span className={s.portraitDots} /><Image src="/images/aviva-portrait.webp" alt="A smiling creative professional pointing toward Aviva's services" width={900} height={980} sizes="(max-width: 700px) 85vw, 35vw" /></div><Reveal className={s.whyCopy}><Label>Why us</Label><h2 id="why-heading">Top reason most company<br />choose <span>Aviva Web Technology</span></h2><p className={s.whyLead}>There are many experienced engineers for your it solution services that give awesome solutions.</p><p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock.</p><ul className={s.benefits}>{["Product Engineering", "Digital Services", "Automated Software", "Excellent 24/7 Support available"].map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul><a href="#services" className={s.orangeButton}>Discover More</a></Reveal><OrbitDecoration className={s.whySpark} mirrored /></section>

    <Reveal><section className={s.stats} aria-label="Aviva in numbers"><ContourParticles className={s.statsRing} shape="ring" /><dl>{[{value:"17+",label:"Years of experience"},{value:"500+",label:"Project completed"},{value:"399+",label:"Happy customers"}].map((stat) => <div key={stat.label}><CountUp as="dt" value={parseInt(stat.value, 10)} suffix="+" /><dd>{stat.label}</dd></div>)}</dl><div className={s.skills}><span className={s.skillsTorus} aria-hidden="true" /><div className={s.skillsHeading}><h2 id="skills-heading">The skills behind the work</h2></div><div className={s.skillsIntro}><p>A blend of creativity, strategy, and technical skill—crafted through experience to deliver results A blend ofted through experience to deliver results</p><a href="#about" className={s.skillsLink}>View profile<Arrow /></a></div><DropList className={s.skillPills} labelledBy="skills-heading">{skills.map((skill, index) => <li key={skill.name} className={`${s.skill} ${skill.x === undefined ? "" : s.skillLoose} ${skill.tilted ? s.skillTilted : ""}`} style={{ "--c": skillColors[skill.icon], "--delay": `${skill.x === undefined ? index * 80 : 650 + (index - 7) * 120}ms`, "--spin": `${(index % 2 ? -1 : 1) * (22 + index * 7 % 34)}deg`, ...(skill.x === undefined ? {} : { "--x": `${skill.x}%`, "--y": skill.y }) } as React.CSSProperties}><Image src={`/images/skills/${skill.icon}.svg`} alt="" width={22} height={22} unoptimized />{skill.name}</li>)}</DropList></div></section></Reveal>

    <section id="blog" className={s.news} aria-labelledby="blog-heading"><div className={s.container}><Reveal className={s.center}><Label>Blogs & news</Label><h2 id="blog-heading">Our Latest News & Blog Posts</h2></Reveal><div className={s.blogGrid}>{articles.map((article) => <Reveal key={article.image}><BlogCard article={article} hasArrow /></Reveal>)}</div><div className={s.center}><a href={`mailto:${email}?subject=Aviva%20news%20and%20insights`} className={s.textLink}>More Blog Posts<Arrow /></a></div></div></section>

    <div className={s.footerDesk} aria-hidden="true"><Image src="/images/footer-desk.png" alt="" width={1920} height={800} sizes="100vw" /></div>
    <footer id="contact" className={s.footer}><div className={s.footerInner}><div className={s.footerTop}><Logo /><a href="tel:+014548333"><span className={s.footerContactIcon}>☏</span><span>Phone<small>+014548333</small></span></a><a href="https://wa.me/9779851001237" target="_blank" rel="noreferrer"><svg className={s.footerWhatsapp} viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Z"/><path fill="#fff" d="M8.1 6.6c-.3 0-.6.1-.8.4-.4.4-1 1-1 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.2.1 1.7.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-.9 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.8Z"/></svg><span>WhatsApp<small>+9779851001237</small></span></a><SocialLinks labels /></div><div className={s.footerMain}><div className={s.invitation}><h2>LET’S WORK<span>TOGETHER</span></h2><a href={`mailto:${email}`} className={s.footerEmail} data-quote>GET A QUOTE<Arrow /></a></div><div className={s.footerLinks}><h3>Quick Links</h3><div>{[{label:"Home",href:"#home"},{label:"SEO",href:"#services"},{label:"UI / UX Design",href:"#services"},{label:"WordPress",href:"#services"},{label:"Portfolio",href:"#projects"},{label:"Popular Services",href:"#services"},{label:"Web Design",href:"#services"},{label:"Branding",href:"#services"}].map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div></div><div className={s.footerOther}><h3>Other</h3><a href={`mailto:${email}?subject=Vacancy%20enquiry`}>Vacancy</a><a href="#process">How IT Works</a></div><RollingLink href={`mailto:${email}`} slotClassName={s.footerCtaSlot} className={`${s.footerCta} ambient-motion`}>Message<br />Us<Arrow /></RollingLink></div><div className={s.copyright}>© 2026 <span>AVIVA.</span> All Rights Reserved</div></div></footer>
  </main>;
}
