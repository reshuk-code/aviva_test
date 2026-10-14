import Image from "next/image";
import Link from "next/link";
import { Arrow, Art } from "./components/design";
import { BlogCard, Header, HeroControls, DropList, ProjectCard, Reveal, ScrollEffects } from "./components/interactive";
import s from "./home.module.css";
import { HeroSculpture } from "./components/hero-sculpture";
import { ContourParticles } from "./components/contour-particles";
import { CountUp } from "./components/count-up";
import { OrbitDecoration } from "./components/orbit-decoration";

import { HeaderWave } from "./components/header-wave";
import { QuoteWizard } from "./components/quote-wizard";
import { SiteFooter } from "./components/site-footer";

import { field, getFeatured, getPage } from "./lib/content";
const stepIcons = ["vector-2", "vector-3", "vector-4"];
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

/** Headings typed on two lines in the admin keep their line break. */
const lines = (text: string) => text.split("\n").flatMap((line, index) => index ? [<br key={index} />, line] : [line]);
const digits = (value: string) => value.replace(/\D/g, "");

export default async function Home() {
  const [{ projects: featuredWorks, posts: featuredPosts, services }, { content }] = await Promise.all([getFeatured(), getPage("home")]);
  const t = (key: string) => field.text(content, key);
  const office = field.image(content, "heroImage"), portrait = field.image(content, "whyImage");
  const steps = field.list<{ title: string; text: string }>(content, "steps");
  const stats = field.list<{ value: string; label: string }>(content, "stats");
  const benefits = field.list<{ text: string }>(content, "benefits");
  const whatsapp = digits(t("heroWhatsapp"));
  return <main id="home" className={`${s.page} site-shell`}>
    <HeaderWave />
    <ScrollEffects />
    <a href="#about" className="skip-link">Skip to content</a>
    <Header />
    <QuoteWizard />

    <section className={s.hero} aria-labelledby="hero-heading">
      <div className={s.heroCopy}><p className={s.heroLead}>{t("heroLead")}</p><h1 id="hero-heading"><span>{t("heroLine1")}</span><span className={s.outline}>{t("heroLine2")}</span><span className={s.company}>{t("heroLine3")}</span></h1></div>
      <Art name="image-1" className={`${s.heroDashes} ambient-motion`} />
      <HeroSculpture className={s.heroArtwork} />
      <div className={`${s.heroOffice} hero-office`}><Image src={office.src} alt={office.alt} fill sizes="(max-width: 900px) 100vw, 65vw" preload className="object-cover" /><HeroControls /></div>
      <div className={s.heroNote}><Art name="image-189" className={s.signature} /><p>{t("heroNote1")}</p><p>{t("heroNote2")}</p><div className={s.heroAuthor}><Art name="ellipse-330" className={s.heroAvatar} alt={t("heroRole")} /><div><strong>{t("heroName")}</strong><span>{t("heroRole")}</span></div>{whatsapp && <a href={`https://wa.me/${whatsapp.length === 10 ? `977${whatsapp}` : whatsapp}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${t("heroName")} at ${t("heroWhatsapp")}`}><svg className={s.authorWhatsapp} viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Z"/><path fill="#fff" d="M8.1 6.6c-.3 0-.6.1-.8.4-.4.4-1 1-1 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.2.1 1.7.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-.9 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.8Z"/></svg>{t("heroWhatsapp")}</a>}</div></div>
    </section>

    <section className={`${s.marquee} marquee`} aria-label="Design, web design, and copywriting"><div className={`${s.marqueeTrack} marquee-track`} aria-hidden="true"><span>{t("marqueeSolid")}&nbsp; </span><span>{t("marqueeSolid")}&nbsp; </span></div><div className={`${s.marqueeOutline} marquee-outline`} aria-hidden="true"><span>{t("marqueeOutline")}&nbsp; {t("marqueeOutline")}&nbsp; </span></div></section>

    <Reveal><section className={s.collage} aria-label={`${t("experienceYears")}+ years of creative experience`}><div className={s.collageLeft}><Art name="image-192" className={`${s.eye} cursor-photo`} alt="An expressive eye surrounded by vivid orange and blue paint" /><div className={s.experience}><CountUp value={parseInt(t("experienceYears"), 10) || 0} suffix="+" /><div><span>YEARS</span><b>EXPERIENCE</b></div></div></div><Art name="image-193" className={`${s.collageWoman} cursor-photo`} alt="An artistic portrait framed by a collage of leaves and paper" /><div className={s.collageRight}><div className={s.stars}><Art name="image-194" className={`${s.outlineStar} ambient-motion`} /><Art name="image-195" className={`${s.goldStar} ambient-motion`} /></div><Art name="image-196" className={`${s.future} cursor-photo`} alt="A futuristic portrait with a translucent neon visor" /></div></section></Reveal>

    <section id="about" className={s.about} aria-labelledby="about-heading"><ContourParticles className={s.aboutPrint} shape="terrain" /><OrbitDecoration className={s.aboutScribble} /><Reveal className={s.aboutCopy}><Label>{t("aboutLabel")}</Label><h2 id="about-heading">{lines(t("aboutHeading"))}</h2><p className={s.aboutLead}>{t("aboutLead")}</p><p>{t("aboutText")}</p><a href="#services" className={s.readMore}>{t("aboutLink")}</a></Reveal></section>

    <Reveal><section id="services" className={`${s.services} ${s.container}`} aria-labelledby="services-heading"><ContourParticles className={s.serviceRing} shape="ring" /><ContourParticles className={s.servicesPrint} shape="terrain" /><h2 id="services-heading">{t("servicesHeading1")}<br /><span><a href="/contact" data-quote className={s.goldCircle} aria-label="Discuss an idea"><Arrow /></a>{t("servicesHeading2")}</span></h2><div className={s.servicesGrid}>{services.map((service,index) => <Link href={`/services/${service.slug}`} className={s.service} key={service.slug}><h3>{service.title}</h3><p>{service.summary}</p><div className={s.serviceBottom}><span className={s.serviceArrow}><Arrow /></span><span className={s.serviceNumber}>0{index+1}</span></div></Link>)}</div></section></Reveal>

    <section id="projects" className={`${s.projects} ${s.container}`} aria-labelledby="projects-heading"><Reveal><Label>{t("projectsLabel")}</Label><h2 id="projects-heading">{t("projectsHeading")}</h2></Reveal><div className={s.projectGrid}>{featuredWorks.map((project) => <Reveal key={project.slug}><ProjectCard project={project} /></Reveal>)}</div><div className={s.center}><Link href="/portfolio" className={s.textLink}>{t("projectsLink")}<Arrow /></Link></div></section>

    <Reveal><section id="process" className={s.process} aria-labelledby="process-heading"><ContourParticles className={s.processPrintLeft} shape="ring" /><ContourParticles className={s.processPrintRight} shape="terrain" /><div className={s.center}><Label>{t("processLabel")}</Label><h2 id="process-heading">{t("processHeading")}</h2></div><div className={s.processGrid}>{steps.map((step, index) => <article key={`${index}-${step.title}`} className={s.step}><span className={s.stepIcon}><Art name={stepIcons[index % stepIcons.length]} /></span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section></Reveal>

    <section id="why-us" className={`${s.whyUs} ${s.container}`} aria-labelledby="why-heading"><div className={`${s.whyPortrait} cursor-portrait`}><div className={s.portraitShape} /><span className={s.portraitDots} /><Image src={portrait.src} alt={portrait.alt} width={900} height={980} sizes="(max-width: 900px) 85vw, 35vw" /></div><Reveal className={s.whyCopy}><Label>{t("whyLabel")}</Label><h2 id="why-heading">{lines(t("whyHeading"))} <span>{t("whyHighlight")}</span></h2><p className={s.whyLead}>{t("whyLead")}</p><p>{t("whyText")}</p><ul className={s.benefits}>{benefits.map((benefit) => <li key={benefit.text}><span aria-hidden="true">✓</span>{benefit.text}</li>)}</ul><a href="#services" className={s.orangeButton}>{t("whyButton")}</a></Reveal><OrbitDecoration className={s.whySpark} mirrored /></section>

    <Reveal><section className={s.stats} aria-label="Aviva in numbers"><ContourParticles className={s.statsRing} shape="ring" /><dl>{stats.map((stat) => <div key={stat.label}><CountUp as="dt" value={parseInt(stat.value, 10) || 0} suffix={stat.value.replace(/^[\d,.\s]+/, "")} /><dd>{stat.label}</dd></div>)}</dl><div className={s.skills}><span className={s.skillsTorus} aria-hidden="true" /><div className={s.skillsHeading}><h2 id="skills-heading">{t("skillsHeading")}</h2></div><div className={s.skillsIntro}><p>{t("skillsIntro")}</p><a href="#about" className={s.skillsLink}>{t("skillsLink")}<Arrow /></a></div><DropList className={s.skillPills} labelledBy="skills-heading">{skills.map((skill, index) => <li key={skill.name} className={`${s.skill} ${skill.x === undefined ? "" : s.skillLoose} ${skill.tilted ? s.skillTilted : ""}`} style={{ "--c": skillColors[skill.icon], "--delay": `${skill.x === undefined ? index * 80 : 650 + (index - 7) * 120}ms`, "--spin": `${(index % 2 ? -1 : 1) * (22 + index * 7 % 34)}deg`, ...(skill.x === undefined ? {} : { "--x": `${skill.x}%`, "--y": skill.y }) } as React.CSSProperties}><Image src={`/images/skills/${skill.icon}.svg`} alt="" width={22} height={22} unoptimized />{skill.name}</li>)}</DropList></div></section></Reveal>

    <section id="blog" className={s.news} aria-labelledby="blog-heading"><div className={s.container}><Reveal className={s.center}><Label>{t("blogLabel")}</Label><h2 id="blog-heading">{t("blogHeading")}</h2></Reveal><div className={s.blogGrid}>{featuredPosts.map((article) => <Reveal key={article.slug}><BlogCard article={article} hasArrow /></Reveal>)}</div><div className={s.center}><Link href="/blog" className={s.textLink}>{t("blogLink")}<Arrow /></Link></div></div></section>

    <div className={s.footerDesk} aria-hidden="true"><Image src="/images/footer-desk.png" alt="" width={1920} height={800} sizes="100vw" /></div>
    <SiteFooter />
  </main>;
}
