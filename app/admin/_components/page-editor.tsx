"use client";

import type { Seo } from "../../lib/content";
import { pageDefinition, type Field as FieldDefinition, type ImageValue } from "../../lib/page-fields";
import { savePage } from "../actions";
import c from "../cms.module.css";
import { EditorScreen, Field, Panel, SeoPanel, SeoScore, Tabs, useDraft, type SeoContext } from "./editor";
import { ImageField } from "./media";
import { Repeater } from "./repeater";
import { RichText } from "./rich-text";

type Values = Record<string, unknown>;

function emptyValue(field: FieldDefinition): unknown {
  if (field.type === "image") return { src: "", alt: "" };
  if (field.type === "list") return [];
  return "";
}

/** One control per field type; lists render their item fields recursively. */
function Control({ field, value, onChange }: { field: FieldDefinition; value: unknown; onChange: (value: unknown) => void }) {
  if (field.type === "image") return <ImageField label={field.label} value={(value as ImageValue) ?? { src: "", alt: "" }} onChange={onChange} />;
  if (field.type === "richtext") return <div className={c.field}><span>{field.label}</span><RichText label={field.label} value={String(value ?? "")} onChange={onChange} /></div>;
  if (field.type === "list") {
    const items = Array.isArray(value) ? value as Values[] : [];
    return <Repeater label={field.label} itemLabel={field.itemLabel ?? "Item"} hint={field.help} items={items} onChange={onChange}
      create={() => Object.fromEntries((field.item ?? []).map((sub) => [sub.key, emptyValue(sub)]))}
      render={(item, change) => (field.item ?? []).map((sub) => <Control key={sub.key} field={sub} value={item[sub.key]} onChange={(next) => change({ ...item, [sub.key]: next })} />)} />;
  }
  const text = String(value ?? "");
  return <Field label={field.label} hint={field.help}>
    {field.type === "textarea" ? <textarea rows={Math.min(8, Math.max(3, Math.ceil(text.length / 90)))} value={text} onChange={(event) => onChange(event.target.value)} /> : <input value={text} onChange={(event) => onChange(event.target.value)} />}
  </Field>;
}

export function PageEditor({ pageKey, content, seo, updatedAt, context }: { pageKey: string; content: Values; seo: Seo; updatedAt: string; context: SeoContext }) {
  const definition = pageDefinition(pageKey)!;
  const { value: v, update, dirty } = useDraft({ content, seo });
  const set = (key: string, next: unknown) => update("content", { ...v.content, [key]: next });
  const hasSeo = definition.seo.title !== "";
  return <EditorScreen noun="Page" title={`Edit page: ${definition.title}`} backHref="/admin/pages" backLabel="All pages" viewHref={definition.path}
    isNew={false} updatedAt={updatedAt || undefined} dirty={dirty} save={() => savePage(pageKey, v.content, v.seo)}
    main={<>
      <p className={c.hint}>{definition.description}</p>
      <Tabs label={`${definition.title} sections`} tabs={definition.sections.map((section) => ({ id: section.title.toLowerCase().replace(/\W+/g, "-"), label: section.title,
        content: section.fields.map((field) => <Control key={field.key} field={field} value={v.content[field.key]} onChange={(next) => set(field.key, next)} />) }))} />
      {hasSeo && <SeoPanel value={v.seo} onChange={(next) => update("seo", next)} path={definition.path} fallbackTitle={definition.title} fullTitle={definition.seo.title} fallbackDescription={definition.seo.description} context={context} />}
    </>}
    side={hasSeo ? <SeoScore value={v.seo} fallbackTitle={definition.title} fullTitle={definition.seo.title} fallbackDescription={definition.seo.description} context={context} />
      : <Panel title="SEO"><p className={c.hint}>Each service page uses its own SEO settings, edited under Services.</p></Panel>} />;
}
