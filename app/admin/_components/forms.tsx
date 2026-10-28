"use client";

import type { Faq, Post, Project, Seo, Service, TeamMember } from "../../lib/content";
import { technologies } from "../../lib/tech";
import { deleteMember, deletePost, deleteProject, deleteService, saveMember, savePost, saveProject, saveService } from "../actions";
import c from "../cms.module.css";
import { EditorScreen, Field, Panel, SeoPanel, SeoScore, SlugField, slugify, TagField, Tabs, useDraft, type SeoContext } from "./editor";
import { ImageField } from "./media";
import { Repeater } from "./repeater";
import { RichText } from "./rich-text";

const noSeo: Seo = { seoTitle: "", seoDescription: "", ogImage: "", noindex: false };
const pickSeo = (item?: Seo): Seo => item ? { seoTitle: item.seoTitle, seoDescription: item.seoDescription, ogImage: item.ogImage, noindex: item.noindex } : noSeo;
const techNames = technologies.map((tech) => tech.name);

/** The slug follows the name while it still matches it. Existing items whose slug was set by hand keep it, so published links don't change by accident. */
const followsName = (name: string, slug: string) => !slug || slug === slugify(name);

function NameBlock({ name, slug, auto, prefix, context, placeholder, label, onChange }: { name: string; slug: string; auto: boolean; prefix?: string; context: SeoContext; placeholder: string; label: string; onChange: (next: { name: string; slug: string; auto: boolean }) => void }) {
  return <div className={c.titleBlock}>
    <label className={c.fieldLabel} htmlFor="item-name">{label}</label>
    <input id="item-name" className={c.titleInput} value={name} placeholder={placeholder} required
      onChange={(event) => onChange({ name: event.target.value, slug: auto ? slugify(event.target.value) : slug, auto })} />
    {prefix && <SlugField prefix={prefix} value={slug} context={context} auto={auto}
      onChange={(value) => onChange({ name, slug: value, auto: value === slugify(name) })}
      onReset={() => onChange({ name, slug: slugify(name), auto: true })} />}
  </div>;
}

function FaqList({ faqs, onChange, label = "Frequently asked questions" }: { faqs: Faq[]; onChange: (faqs: Faq[]) => void; label?: string }) {
  return <Repeater label={label} itemLabel="Question" items={faqs} onChange={onChange} create={() => ({ question: "", answer: "" })}
    render={(faq, change) => <>
      <input value={faq.question} maxLength={200} placeholder="Question" aria-label="Question" onChange={(event) => change({ ...faq, question: event.target.value })} />
      <RichText minimal label="Answer" value={faq.answer} placeholder="Answer" onChange={(answer) => change({ ...faq, answer })} />
    </>} />;
}

// --- Services ------------------------------------------------------------

export function ServiceForm({ item, context }: { item: Service | null; context: SeoContext }) {
  const { value: v, update, setValue, dirty } = useDraft({
    title: item?.title ?? "", slug: item?.slug ?? "", auto: item ? followsName(item.title, item.slug) : true,
    summary: item?.summary ?? "", introHeading: item?.introHeading ?? "", intro: item?.intro ?? "", bodyHeading: item?.bodyHeading ?? "", body: item?.body ?? "",
    highlights: item?.highlights ?? [], techStack: item?.techStack ?? [], faqs: item?.faqs ?? ([] as Faq[]),
    image: { src: item?.image ?? "", alt: item?.imageAlt ?? "" }, gallery1: { src: item?.gallery[0] ?? "", alt: "" }, gallery2: { src: item?.gallery[1] ?? "", alt: "" },
    published: item?.published ?? true, seo: pickSeo(item ?? undefined),
  });
  return <EditorScreen noun="Service" title={item ? "Edit service" : "Add new service"} backHref="/admin/services" backLabel="All services" viewHref={item ? `/services/${item.slug}` : undefined}
    isNew={!item} updatedAt={item?.updatedAt} dirty={dirty} published={v.published} onPublishedChange={(published) => update("published", published)} editPath={(id) => `/admin/services/${id}`}
    save={() => saveService({ id: item?.id, title: v.title, slug: v.slug, summary: v.summary, introHeading: v.introHeading, intro: v.intro, bodyHeading: v.bodyHeading, body: v.body, highlights: v.highlights, techStack: v.techStack, faqs: v.faqs, image: v.image.src, imageAlt: v.image.alt, gallery: [v.gallery1.src, v.gallery2.src], published: v.published, ...v.seo })}
    remove={item ? () => deleteService(item.id) : undefined}
    main={<>
      <NameBlock label="Service name" name={v.title} slug={v.slug} auto={v.auto} prefix="/services/" context={context} placeholder="e.g. Website Design" onChange={(next) => setValue((draft) => ({ ...draft, title: next.name, slug: next.slug, auto: next.auto }))} />
      <Tabs label="Service sections" tabs={[
        { id: "overview", label: "Overview", content: <>
          <Field label="Short description" hint="One sentence for the service card on the home page and for search results."><textarea rows={2} value={v.summary} maxLength={300} onChange={(event) => update("summary", event.target.value)} /></Field>
          <Field label="Intro heading"><input value={v.introHeading} maxLength={160} onChange={(event) => update("introHeading", event.target.value)} placeholder="e.g. Web Technology Services" /></Field>
          <div className={c.field}><span>Intro</span><RichText label="Intro" value={v.intro} onChange={(intro) => update("intro", intro)} /></div>
        </> },
        { id: "content", label: "Details", content: <>
          <Field label="Second heading"><input value={v.bodyHeading} maxLength={160} onChange={(event) => update("bodyHeading", event.target.value)} placeholder="e.g. Reliable Digital Solutions for Every Business" /></Field>
          <div className={c.field}><span>Second section</span><RichText label="Second section" value={v.body} onChange={(body) => update("body", body)} /></div>
          <Repeater label="Highlights" itemLabel="Highlight" hint="Shown with gold ticks." items={v.highlights} onChange={(highlights) => update("highlights", highlights)} create={() => ""}
            render={(text, change) => <input value={text} maxLength={300} onChange={(event) => change(event.target.value)} aria-label="Highlight" />} />
        </> },
        { id: "tech", label: "Tech stack", badge: v.techStack.length, content: <TagField label="Technologies" hint="Shown on the service page. Known technologies get their logo." value={v.techStack} onChange={(techStack) => update("techStack", techStack)} suggestions={techNames} /> },
        { id: "faqs", label: "FAQs", badge: v.faqs.length, content: <FaqList faqs={v.faqs} onChange={(faqs) => update("faqs", faqs)} /> },
      ]} />
      <SeoPanel value={v.seo} onChange={(seo) => update("seo", seo)} path={`/services/${v.slug}`} fallbackTitle={v.title || "Service"} fallbackDescription={v.summary} context={context} />
    </>}
    side={<>
      <Panel title="Featured image"><ImageField label="Banner image" required value={v.image} onChange={(image) => update("image", image)} /></Panel>
      <Panel title="Photos" defaultOpen={false}><ImageField label="Photo 1" value={v.gallery1} onChange={(image) => update("gallery1", image)} /><ImageField label="Photo 2" value={v.gallery2} onChange={(image) => update("gallery2", image)} /></Panel>
      <SeoScore value={v.seo} fallbackTitle={v.title || "Service"} fallbackDescription={v.summary} context={context} slug={v.slug} image={v.image.src} imageAlt={v.image.alt} content={`${v.intro} ${v.body}`} />
    </>} />;
}

// --- Projects ------------------------------------------------------------

export function ProjectForm({ item, context }: { item: Project | null; context: SeoContext }) {
  const { value: v, update, setValue, dirty } = useDraft({
    title: item?.title ?? "", slug: item?.slug ?? "", auto: item ? followsName(item.title, item.slug) : true,
    category: item?.category ?? "", description: item?.description ?? "", body: item?.body ?? "", techStack: item?.techStack ?? [],
    image: { src: item?.image ?? "", alt: item?.imageAlt ?? "" }, client: item?.client ?? "", year: item?.year ?? String(new Date().getFullYear()), website: item?.website ?? "",
    featured: item?.featured ?? false, published: item?.published ?? true, seo: pickSeo(item ?? undefined),
  });
  return <EditorScreen noun="Project" title={item ? "Edit project" : "Add new project"} backHref="/admin/projects" backLabel="All projects" viewHref={item ? `/portfolio/${item.slug}` : undefined}
    isNew={!item} updatedAt={item?.updatedAt} dirty={dirty} published={v.published} onPublishedChange={(published) => update("published", published)} editPath={(id) => `/admin/projects/${id}`}
    save={() => saveProject({ id: item?.id, title: v.title, slug: v.slug, category: v.category, description: v.description, body: v.body, image: v.image.src, imageAlt: v.image.alt, client: v.client, year: v.year, website: v.website, techStack: v.techStack, featured: v.featured, published: v.published, ...v.seo })}
    remove={item ? () => deleteProject(item.id) : undefined}
    main={<>
      <NameBlock label="Project name" name={v.title} slug={v.slug} auto={v.auto} prefix="/portfolio/" context={context} placeholder="Project name" onChange={(next) => setValue((draft) => ({ ...draft, title: next.name, slug: next.slug, auto: next.auto }))} />
      <Tabs label="Project sections" tabs={[
        { id: "overview", label: "Overview", content: <>
          <Field label="Short description" hint="Shown on project cards, at the top of the project page and in search results."><textarea rows={3} value={v.description} maxLength={600} onChange={(event) => update("description", event.target.value)} /></Field>
          <div className={c.twoColumns}>
            <Field label="Category"><input value={v.category} maxLength={80} onChange={(event) => update("category", event.target.value)} placeholder="e.g. Brand, Photography" /></Field>
            <Field label="Client"><input value={v.client} maxLength={80} onChange={(event) => update("client", event.target.value)} placeholder="Optional" /></Field>
            <Field label="Year"><input value={v.year} maxLength={10} onChange={(event) => update("year", event.target.value)} /></Field>
            <Field label="Live website" hint="Optional link shown on the project page."><input type="url" value={v.website} maxLength={300} onChange={(event) => update("website", event.target.value)} placeholder="https://" /></Field>
          </div>
          <label className={c.check}><input type="checkbox" checked={v.featured} onChange={(event) => update("featured", event.target.checked)} /><span>Feature on the home page<small>Up to four featured projects appear on the home page.</small></span></label>
        </> },
        { id: "story", label: "Project story", content: <div className={c.field}><span>Story</span><RichText label="Project story" value={v.body} onChange={(body) => update("body", body)} placeholder="The brief, the approach and the result." /></div> },
        { id: "tech", label: "Tech stack", badge: v.techStack.length, content: <TagField label="Technologies used" value={v.techStack} onChange={(techStack) => update("techStack", techStack)} suggestions={techNames} /> },
      ]} />
      <SeoPanel value={v.seo} onChange={(seo) => update("seo", seo)} path={`/portfolio/${v.slug}`} fallbackTitle={v.title || "Project"} fallbackDescription={v.description} context={context} />
    </>}
    side={<>
      <Panel title="Featured image"><ImageField label="Cover image" required value={v.image} onChange={(image) => update("image", image)} /></Panel>
      <SeoScore value={v.seo} fallbackTitle={v.title || "Project"} fallbackDescription={v.description} context={context} slug={v.slug} image={v.image.src} imageAlt={v.image.alt} content={`${v.description} ${v.body}`} />
    </>} />;
}

// --- Blog posts ----------------------------------------------------------

export function PostForm({ item, categories, context }: { item: Post | null; categories: string[]; context: SeoContext }) {
  const { value: v, update, setValue, dirty } = useDraft({
    title: item?.title ?? "", slug: item?.slug ?? "", auto: item ? followsName(item.title, item.slug) : true,
    category: item?.category ?? "", excerpt: item?.excerpt ?? "", body: item?.body ?? "",
    image: { src: item?.image ?? "", alt: item?.imageAlt ?? "" }, publishedAt: item?.publishedAt ?? new Date().toISOString().slice(0, 10),
    published: item?.published ?? true, seo: pickSeo(item ?? undefined),
  });
  const scheduled = v.published && v.publishedAt > new Date().toISOString().slice(0, 10);
  return <EditorScreen noun="Post" title={item ? "Edit post" : "Add new post"} backHref="/admin/posts" backLabel="All posts" viewHref={item ? `/blog/${item.slug}` : undefined}
    isNew={!item} updatedAt={item?.updatedAt} dirty={dirty} published={v.published} onPublishedChange={(published) => update("published", published)} editPath={(id) => `/admin/posts/${id}`}
    publishExtra={<Field label="Publish date" hint={scheduled ? "Scheduled: the post goes live on this date." : undefined}><input type="date" value={v.publishedAt} onChange={(event) => update("publishedAt", event.target.value)} /></Field>}
    save={() => savePost({ id: item?.id, title: v.title, slug: v.slug, category: v.category, excerpt: v.excerpt, body: v.body, image: v.image.src, imageAlt: v.image.alt, publishedAt: v.publishedAt, published: v.published, ...v.seo })}
    remove={item ? () => deletePost(item.id) : undefined}
    main={<>
      <NameBlock label="Post title" name={v.title} slug={v.slug} auto={v.auto} prefix="/blog/" context={context} placeholder="Add title" onChange={(next) => setValue((draft) => ({ ...draft, title: next.name, slug: next.slug, auto: next.auto }))} />
      <Tabs label="Post sections" tabs={[
        { id: "content", label: "Content", content: <div className={c.field}><span>Article</span><RichText label="Article" value={v.body} onChange={(body) => update("body", body)} placeholder="Start writing your post…" /></div> },
        { id: "summary", label: "Summary & category", content: <>
          <Field label="Excerpt" hint="Shown in bold at the top of the post and used for search results if no meta description is set."><textarea rows={3} value={v.excerpt} maxLength={500} onChange={(event) => update("excerpt", event.target.value)} /></Field>
          <Field label="Category"><input list="post-categories" value={v.category} maxLength={60} onChange={(event) => update("category", event.target.value)} placeholder="Choose or type a new one" /></Field>
          <datalist id="post-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
        </> },
      ]} />
      <SeoPanel value={v.seo} onChange={(seo) => update("seo", seo)} path={`/blog/${v.slug}`} fallbackTitle={v.title || "Post"} fallbackDescription={v.excerpt} context={context} />
    </>}
    side={<>
      <Panel title="Featured image"><ImageField label="Featured image" required value={v.image} onChange={(image) => update("image", image)} /></Panel>
      <SeoScore value={v.seo} fallbackTitle={v.title || "Post"} fallbackDescription={v.excerpt} context={context} slug={v.slug} image={v.image.src} imageAlt={v.image.alt} content={v.body} />
    </>} />;
}

// --- Team ----------------------------------------------------------------

export function MemberForm({ item }: { item: TeamMember | null }) {
  const { value: v, update, dirty } = useDraft({ name: item?.name ?? "", role: item?.role ?? "", bio: item?.bio ?? "", image: { src: item?.image ?? "", alt: item?.imageAlt ?? "" }, published: item?.published ?? true });
  return <EditorScreen noun="Team member" title={item ? "Edit team member" : "Add team member"} backHref="/admin/team" backLabel="All team members"
    isNew={!item} updatedAt={item?.updatedAt} dirty={dirty} published={v.published} onPublishedChange={(published) => update("published", published)} editPath={(id) => `/admin/team/${id}`}
    save={() => saveMember({ id: item?.id, name: v.name, role: v.role, bio: v.bio, image: v.image.src, imageAlt: v.image.alt, published: v.published })}
    remove={item ? () => deleteMember(item.id) : undefined}
    main={<>
      <div className={c.titleBlock}><label className={c.fieldLabel} htmlFor="item-name">Full name</label><input id="item-name" className={c.titleInput} value={v.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" required /></div>
      <Tabs label="Profile sections" tabs={[
        { id: "profile", label: "Profile", content: <Field label="Role"><input value={v.role} maxLength={80} onChange={(event) => update("role", event.target.value)} placeholder="e.g. Design Director" /></Field> },
        { id: "bio", label: "Bio", content: <div className={c.field}><span>Bio</span><RichText minimal label="Bio" value={v.bio} onChange={(bio) => update("bio", bio)} placeholder="A few sentences about them." /></div> },
      ]} />
    </>}
    side={<Panel title="Featured image"><ImageField label="Photo" required round value={v.image} onChange={(image) => update("image", image)} /></Panel>} />;
}
