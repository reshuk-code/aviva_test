"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Fingerprint, Logo } from "../components/design";
import { initialArticles, initialInquiries, initialProjects, initialTeam, type ContentItem } from "./demo-data";
import s from "./studio.module.css";

type Section = "Overview" | "Projects" | "Blog posts" | "Team members" | "Inquiries" | "Settings";
type IconName = "grid" | "folder" | "article" | "people" | "mail" | "settings" | "arrow" | "chevron" | "plus" | "search" | "bell" | "close" | "menu" | "check" | "edit" | "globe" | "chart";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    folder: <path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    article: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    settings: <><path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 2 3h3l1-3 3-1 2-3-2-2 1-3-2-3-3 1-2-3H9Z" /><circle cx="12" cy="12" r="3" /></>,
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <><path d="m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    chart: <><path d="M4 3v17h17M8 15l4-5 4 2 5-6" /></>,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const navigation: { label: Section; icon: IconName }[] = [
  { label: "Overview", icon: "grid" }, { label: "Projects", icon: "folder" },
  { label: "Blog posts", icon: "article" }, { label: "Team members", icon: "people" },
  { label: "Inquiries", icon: "mail" }, { label: "Settings", icon: "settings" },
];

function Status({ status }: { status: string }) {
  return <span className={`${s.status} ${status === "Draft" ? s.draft : s.published}`}><span />{status}</span>;
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog className={s.modal} ref={ref} aria-labelledby="admin-dialog-title" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div className={s.modalHeading}><div><span className={s.overline}>AVIVA STUDIO</span><h2 id="admin-dialog-title">{title}</h2></div><button className={s.iconButton} aria-label="Close dialog" onClick={close}><Icon name="close" /></button></div>
    {children}
  </dialog>;
}

function ContentEditor({ item, kind, close, save }: { item?: ContentItem; kind: Section; close: () => void; save: (item: ContentItem) => void }) {
  const noun = kind === "Blog posts" ? "post" : kind === "Team members" ? "team member" : "project";
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    if (!title || !category) return;
    save({ id: item?.id ?? Date.now(), title, category, description: String(data.get("description") ?? "").trim(), image: String(data.get("image")), status: data.get("status") === "Published" ? "Published" : "Draft", date: "Oct 09, 2026" });
  };
  const images = kind === "Team members" ? initialTeam : [...initialProjects, ...initialArticles];
  return <Modal title={`${item ? "Edit" : "New"} ${noun}`} close={close}>
    <form className={s.editorForm} onSubmit={submit}>
      <label>{kind === "Team members" ? "Full name" : "Title"}<input name="title" required maxLength={100} defaultValue={item?.title} placeholder={kind === "Team members" ? "e.g. Alex Morgan" : "Give your next idea a name"} /></label>
      <label>{kind === "Team members" ? "Role" : "Category"}<input name="category" required maxLength={70} defaultValue={item?.category} placeholder={kind === "Team members" ? "e.g. Design Director" : "e.g. Branding · Digital design"} /></label>
      <label>{kind === "Team members" ? "Bio" : "Description"}<textarea name="description" rows={4} maxLength={1500} defaultValue={item?.description} placeholder="Tell the story behind it…" /></label>
      <div className={s.formColumns}><label>Cover image<select name="image" defaultValue={item?.image ?? images[0].image}>{images.map((image) => <option value={image.image} key={image.id}>{image.title}</option>)}</select></label><label>Status<select name="status" defaultValue={item?.status ?? "Draft"}><option>Draft</option><option>Published</option></select></label></div>
      <p className={s.previewNote}>Design preview. Changes apply to this session only.</p>
      <div className={s.modalActions}><button type="button" className={s.secondaryButton} onClick={close}>Cancel</button><button className={s.primaryButton} type="submit"><Icon name="check" />Save {noun}</button></div>
    </form>
  </Modal>;
}

function ProjectTable({ items, kind, edit, clearFilters }: {
  items: ContentItem[];
  kind: Section;
  edit: (item: ContentItem) => void;
  clearFilters: () => void;
}) {
  return <div className={s.tableScroll}><table className={s.table}>
    <thead><tr><th>{kind === "Blog posts" ? "Post" : "Project name"}</th><th>Category</th><th>Status</th><th>Last updated</th><th><span className={s.srOnly}>Actions</span></th></tr></thead>
    <tbody>{items.map((item) => <tr key={item.id}>
      <td><button className={s.projectTitle} onClick={() => edit(item)}><Image src={`/images/${item.image}.webp`} alt="" width={44} height={44} /><span>{item.title}</span></button></td>
      <td data-label="Category">{item.category}</td><td data-label="Status"><Status status={item.status} /></td><td data-label="Updated">{item.date}</td><td><button className={s.editButton} aria-label={`Edit ${item.title}`} onClick={() => edit(item)}><Icon name="edit" /></button></td>
    </tr>)}</tbody>
  </table>{items.length === 0 && <div className={s.empty}><Icon name="search" /><h3>No matches yet</h3><p>Try another search or add something new.</p><button className={s.textButton} onClick={clearFilters}>Clear filters</button></div>}</div>;
}

export default function AdminPanel() {
  const [section, setSection] = useState<Section>("Overview");
  const [projects, setProjects] = useState(initialProjects);
  const [articles, setArticles] = useState(initialArticles);
  const [team, setTeam] = useState<ContentItem[]>(initialTeam);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editor, setEditor] = useState<{ kind: Section; item?: ContentItem } | null>(null);
  const [inquiry, setInquiry] = useState<(typeof initialInquiries)[number] | null>(null);
  const [toast, setToast] = useState("");
  const [siteName, setSiteName] = useState("Aviva");
  const [siteDescription, setSiteDescription] = useState("Creative Web Solutions for Modern Businesses");
  const [contactEmail, setContactEmail] = useState("avivanepal@example.com");
  const [notifications, setNotifications] = useState(true);
  const unread = inquiries.filter((item) => !item.read).length;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const sidebar = document.getElementById("admin-navigation");
    document.body.style.overflow = "hidden";
    sidebar?.querySelector<HTMLButtonElement>('button[aria-label="Close sidebar"]')?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab") return;
      const controls = sidebar?.querySelectorAll<HTMLElement>('a[href],button');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 981px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [mobileOpen]);

  const navigate = (next: Section) => { setSection(next); setQuery(""); setFilter("All"); setMobileOpen(false); };
  const openInquiry = (item: (typeof initialInquiries)[number]) => { setInquiry(item); setInquiries((items) => items.map((current) => current.id === item.id ? { ...current, read: true } : current)); };
  const save = (item: ContentItem) => {
    const update = (items: ContentItem[]) => items.some((current) => current.id === item.id) ? items.map((current) => current.id === item.id ? item : current) : [item, ...items];
    if (editor?.kind === "Blog posts") setArticles(update);
    else if (editor?.kind === "Team members") setTeam(update);
    else setProjects(update);
    setEditor(null); setToast("Saved in this preview. Your live site is unchanged.");
  };
  const items = section === "Blog posts" ? articles : section === "Team members" ? team : projects;
  const filteredItems = items.filter((item) => (filter === "All" || item.status === filter) && `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const filteredInquiries = inquiries.filter((item) => (filter !== "Unread" || !item.read) && `${item.name} ${item.company} ${item.subject}`.toLowerCase().includes(query.toLowerCase()));
  const newLabel = section === "Blog posts" ? "New post" : section === "Team members" ? "Add member" : "New project";

  const clearFilters = () => { setQuery(""); setFilter("All"); };

  return <div className={s.shell}>
    <a className={s.skipLink} href="#admin-content">Skip to content</a>
    {mobileOpen && <button className={s.sidebarBackdrop} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`${s.sidebar} ${mobileOpen ? s.sidebarOpen : ""}`} aria-label="Admin sidebar" id="admin-navigation">
      <button className={`${s.iconButton} ${s.sidebarClose}`} aria-label="Close sidebar" onClick={() => setMobileOpen(false)}><Icon name="close" /></button>
      <div className={s.brand}><Logo onClick={(event) => { event.preventDefault(); navigate("Overview"); }} /><span>ADMIN STUDIO</span></div>
      
      <nav className={s.navigation} aria-label="Admin navigation">{navigation.slice(0, 5).map(({ label, icon }) => <button key={label} onClick={() => navigate(label)} className={section === label ? s.navActive : ""} aria-current={section === label ? "page" : undefined}><Icon name={icon} /><span>{label}</span>{label === "Inquiries" && unread > 0 && <span className={s.navCount}>{unread}</span>}{label === "Overview" && section === label && <span className={s.navActiveDot} />}</button>)}</nav>
      <nav className={s.navigation} aria-label="Preferences"><button onClick={() => navigate("Settings")} className={section === "Settings" ? s.navActive : ""} aria-current={section === "Settings" ? "page" : undefined}><Icon name="settings" /><span>Settings</span></button><Link href="/" target="_blank"><Icon name="arrow" /><span>View live website</span></Link></nav>
      <div className={s.sidebarBottom}><div className={s.profile}><span className={s.avatar}>A</span><div>Studio admin<small>Design preview</small></div><span className={s.profileDot} /></div></div>
    </aside>

    <div className={s.mainShell} inert={mobileOpen}>
      <header className={s.topbar}>
        <div className={s.breadcrumb}><button className={`${s.iconButton} ${s.menuButton}`} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="admin-navigation" onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? "close" : "menu"} /></button><strong>{section}</strong></div>
        <div className={s.topbarActions}>{section !== "Settings" && <label className={s.search}><Icon name="search" /><input type="search" placeholder={section === "Inquiries" ? "Search inquiries…" : "Search content…"} aria-label={section === "Inquiries" ? "Search inquiries" : "Search content"} value={query} onChange={(event) => setQuery(event.target.value)} /></label>}<button className={s.notificationButton} aria-label={`View inquiries, ${unread} unread`} onClick={() => navigate("Inquiries")}><Icon name="bell" />{unread > 0 && <span />}</button><span className={s.topAvatar} aria-label="Studio admin">A</span></div>
      </header>

      <main className={s.main} id="admin-content">
        <div className={s.pageHeading}><div><h1>{section === "Overview" ? "Studio overview" : section}</h1></div>{section !== "Inquiries" && section !== "Settings" && <button className={s.primaryButton} onClick={() => setEditor({ kind: section === "Overview" ? "Projects" : section })}><Icon name="plus" />{newLabel}</button>}</div>
        <div className={s.previewBanner}>Preview · Changes reset on reload.</div>

        {section === "Overview" && <>
          <section className={s.stats} aria-label="Content at a glance">{[
            { label: "Total projects", value: projects.length, icon: "folder" as IconName, detail: `${projects.filter((item) => item.status === "Published").length} published`, section: "Projects" as Section, color: "peach" },
            { label: "Blog posts", value: articles.length, icon: "article" as IconName, detail: `${articles.filter((item) => item.status === "Draft").length} draft to finish`, section: "Blog posts" as Section, color: "lavender" },
            { label: "New inquiries", value: unread, icon: "mail" as IconName, detail: "Unread messages", section: "Inquiries" as Section, color: "green" },
            { label: "Team members", value: team.length, icon: "people" as IconName, detail: "Team profiles", section: "Team members" as Section, color: "blue" },
          ].map((stat) => <button key={stat.label} className={s.statCard} onClick={() => navigate(stat.section)}><div className={s.statTop}><span>{stat.label}</span><span className={`${s.statIcon} ${s[stat.color]}`}><Icon name={stat.icon} /></span></div><strong>{String(stat.value).padStart(2, "0")}</strong><div className={s.statBottom}><span><span className={s.statDot} />{stat.detail}</span><Icon name="arrow" /></div></button>)}</section>
          <div className={s.overviewGrid}><section className={s.portfolioSection}><div className={s.portfolioHeading}><div><h2>Recent projects</h2></div><button className={s.textButton} onClick={() => navigate("Projects")}>All projects<Icon name="arrow" /></button></div><div className={s.projectGrid}>{filteredItems.slice(0, 3).map((item) => <article className={s.projectPreview} key={item.id}><button className={s.previewImage} onClick={() => setEditor({ kind: "Projects", item })} aria-label={`Edit ${item.title}`}><Image src={`/images/${item.image}.webp`} alt={item.title} width={600} height={480} /><span className={s.previewEdit}><Icon name="arrow" /></span></button><div className={s.previewCaption}><div><p>{item.category}</p><button className={s.previewProjectTitle} onClick={() => setEditor({ kind: "Projects", item })}>{item.title}</button></div><Status status={item.status} /></div></article>)}{filteredItems.length === 0 && <div className={s.empty}><h3>No matches yet</h3><p>Try another search or add something new.</p><button className={s.textButton} onClick={clearFilters}>Clear filters</button></div>}</div></section>
          <div className={s.middleGrid}>
            <section className={s.contentOverview}><Fingerprint className={s.contentPrint} /><h2>Quick actions</h2><div className={s.contentLinks}><button onClick={() => setEditor({ kind: "Projects" })}><span className={s.actionCircle}><Icon name="plus" /></span>Add a project<Icon name="arrow" /></button><button onClick={() => setEditor({ kind: "Blog posts" })}><span className={s.actionCircle}><Icon name="article" /></span>Add a blog post<Icon name="arrow" /></button><button onClick={() => setEditor({ kind: "Team members" })}><span className={s.actionCircle}><Icon name="people" /></span>Add a team member<Icon name="arrow" /></button></div></section>
            <section className={`${s.card} ${s.quickCard}`}><div className={s.cardHeading}><div><h2>Recent inquiries</h2></div></div><div className={s.quickActions}>{inquiries.map((item) => <button key={item.id} onClick={() => openInquiry(item)}><span className={s.quickIcon}><Icon name="mail" /></span><span><strong>{item.name}{!item.read && <span className={s.inboxDot} />}</strong><small>{item.subject}</small></span><Icon name="chevron" /></button>)}</div><button className={s.quickFooter} onClick={() => navigate("Inquiries")}><span><span className={s.liveDot} />View all inquiries</span><Icon name="arrow" /></button></section>
          </div>
          </div>
        </>}

        {(section === "Projects" || section === "Blog posts" || section === "Team members") && <section className={s.card}>
          <div className={s.listToolbar}><div className={s.tabs} aria-label="Content status filters">{["All", "Published", "Draft"].map((status) => <button key={status} aria-pressed={filter === status} className={filter === status ? s.tabActive : ""} onClick={() => setFilter(status)}>{status === "All" ? `All ${section === "Projects" ? "projects" : section === "Blog posts" ? "posts" : "members"}` : status}<span>{items.filter((item) => status === "All" || item.status === status).length}</span></button>)}</div><span className={s.resultCount}>{filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}</span></div>
          {section === "Team members" ? <div className={s.teamGrid}>{filteredItems.map((member) => <article key={member.id} className={s.teamCard}><div className={s.memberPhoto}><Image src={`/images/${member.image}.webp`} alt={member.title} width={180} height={180} /></div><Status status={member.status} /><h3>{member.title}</h3><p>{member.category}</p><button className={s.secondaryButton} onClick={() => setEditor({ kind: "Team members", item: member })}><Icon name="edit" />Edit profile</button></article>)}{filteredItems.length === 0 && <div className={s.empty}><h3>No members found</h3><p>Try another search or add a team member.</p></div>}</div> : <ProjectTable items={filteredItems} kind={section} edit={(item) => setEditor({ kind: section, item })} clearFilters={clearFilters} />}
          <div className={s.listFooter}>Showing {filteredItems.length} of {items.length} {section === "Blog posts" ? "posts" : section === "Team members" ? "members" : "projects"}</div>
        </section>}

        {section === "Inquiries" && <section className={s.card}><div className={s.listToolbar}><div className={s.tabs}>{["All", "Unread"].map((status) => <button key={status} className={filter === status ? s.tabActive : ""} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status === "All" ? "All inquiries" : status}<span>{status === "All" ? inquiries.length : unread}</span></button>)}</div><span className={s.sampleTag}>Sample inbox</span></div><div className={s.inquiryList}>{filteredInquiries.map((item) => <button className={`${s.inquiryRow} ${!item.read ? s.unreadRow : ""}`} key={item.id} onClick={() => openInquiry(item)}><span className={s.senderAvatar}>{item.initials}</span><span className={s.inquirySender}><strong>{item.name}{!item.read && <i />}</strong><small>{item.company}</small></span><span className={s.inquirySubject}><strong>{item.subject}</strong><small>{item.message}</small></span><span className={s.inquiryMeta}><span>{item.service}</span><small>{item.date}</small></span><Icon name="chevron" /></button>)}{filteredInquiries.length === 0 && <div className={s.empty}><Icon name="mail" /><h3>You’re all caught up</h3><p>No inquiries match this view.</p></div>}</div></section>}

        {section === "Settings" && <div className={s.settingsGrid}><form className={`${s.card} ${s.settingsForm}`} onSubmit={(event) => { event.preventDefault(); setToast("Settings saved for this preview session."); }}><div className={s.cardHeading}><div><h2>Website details</h2></div><Icon name="globe" /></div><div className={s.settingsFields}><label>Website name<input required maxLength={80} value={siteName} onChange={(event) => setSiteName(event.target.value)} /></label><label>Tagline<input required maxLength={150} value={siteDescription} onChange={(event) => setSiteDescription(event.target.value)} /></label><label>Contact email<input required type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} /></label><div className={s.settingToggle}><div><strong>Inquiry notifications</strong><p>Preview your notification preference.</p></div><button type="button" role="switch" aria-checked={notifications} aria-label="Inquiry notifications" className={`${s.toggle} ${notifications ? s.toggleOn : ""}`} onClick={() => setNotifications(!notifications)}><span /></button></div><p className={s.previewNote}>Settings are for this design preview and reset on reload.</p><button className={s.primaryButton} type="submit"><Icon name="check" />Save changes</button></div></form></div>}

        <footer className={s.footer}>Aviva Admin</footer>
      </main>
    </div>
    {editor && <ContentEditor item={editor.item} kind={editor.kind} close={() => setEditor(null)} save={save} />}
    {inquiry && <Modal title={inquiry.subject} close={() => setInquiry(null)}><div className={s.message}><div className={s.messageSender}><span className={s.senderAvatar}>{inquiry.initials}</span><div><strong>{inquiry.name}</strong><p>{inquiry.company} · {inquiry.email}</p></div></div><div className={s.messageMeta}><span>{inquiry.service}</span><span>{inquiry.date}</span></div><p className={s.messageBody}>{inquiry.message}</p><p className={s.previewNote}>Sample inquiry for the design preview.</p><div className={s.modalActions}><button className={s.secondaryButton} onClick={() => setInquiry(null)}>Close message</button></div></div></Modal>}
    {toast && <div className={s.toast} role="status"><span><Icon name="check" /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}><Icon name="close" /></button></div>}
  </div>;
}
