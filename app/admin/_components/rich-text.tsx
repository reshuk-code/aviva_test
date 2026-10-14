"use client";

import ImageExtension from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import c from "../cms.module.css";
import { MediaPicker } from "./media";
import { Icon, type IconName } from "./ui";

/** One block per line, so the HTML view is readable. */
const readable = (html: string) => html.replace(/(<\/(p|h2|h3|h4|li|blockquote|figure|ul|ol)>|<hr>|<br>)/g, "$1\n").replace(/(<(ul|ol)>)/g, "$1\n").trim();

function ToolButton({ icon, label, active, disabled, onClick }: { icon: IconName; label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return <button type="button" className={active ? c.toolActive : ""} aria-label={label} title={label} aria-pressed={active} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick}><Icon name={icon} /></button>;
}

function LinkBar({ editor, close }: { editor: Editor; close: () => void }) {
  const [href, setHref] = useState(editor.getAttributes("link").href ?? "");
  const [newTab, setNewTab] = useState(editor.getAttributes("link").target === "_blank");
  const apply = () => {
    const url = href.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!url) chain.unsetLink().run();
    else chain.setLink({ href: /^(https?:|mailto:|tel:|\/|#)/.test(url) ? url : `https://${url}`, target: newTab ? "_blank" : null }).run();
    close();
  };
  return <div className={c.linkBar}>
    <input autoFocus value={href} onChange={(event) => setHref(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); apply(); } if (event.key === "Escape") close(); }} placeholder="Paste a link, e.g. /contact or https://…" aria-label="Link address" />
    <label><input type="checkbox" checked={newTab} onChange={(event) => setNewTab(event.target.checked)} />New tab</label>
    <button type="button" onClick={apply}>Apply</button>
    <button type="button" onClick={close}>Cancel</button>
  </div>;
}

/** WordPress-style editor: headings, formatting, lists, quotes, links and images from the media library. Produces HTML. */
export function RichText({ value, onChange, placeholder = "Start writing…", label, minimal }: { value: string; onChange: (html: string) => void; placeholder?: string; label: string; minimal?: boolean }) {
  const [linking, setLinking] = useState(false);
  const [picking, setPicking] = useState(false);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [source, setSource] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    // Re-render on each change so the toolbar shows the active formatting.
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } }, codeBlock: false }),
      ImageExtension.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: { attributes: { class: c.prose, "aria-label": label, "aria-multiline": "true", role: "textbox" } },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? "" : current.getHTML()),
  });
  const state = editor ? {
    bold: editor.isActive("bold"), italic: editor.isActive("italic"), underline: editor.isActive("underline"), strike: editor.isActive("strike"),
    h2: editor.isActive("heading", { level: 2 }), h3: editor.isActive("heading", { level: 3 }), bullet: editor.isActive("bulletList"), ordered: editor.isActive("orderedList"),
    quote: editor.isActive("blockquote"), link: editor.isActive("link"), undo: editor.can().undo(), redo: editor.can().redo(),
  } : null;
  if (!editor || !state) return <div className={c.editorFrame}><div className={c.prose} /></div>;
  const toHtml = () => { setSource(readable(editor.isEmpty ? "" : editor.getHTML())); setMode("html"); };
  const toVisual = () => { editor.commands.setContent(source, { emitUpdate: false }); onChange(editor.isEmpty ? "" : editor.getHTML()); setMode("visual"); };
  const modes = <div className={c.modeSwitch} role="tablist" aria-label={`${label} view`}>
    <button type="button" role="tab" aria-selected={mode === "visual"} onClick={() => mode === "html" && toVisual()}>Visual</button>
    <button type="button" role="tab" aria-selected={mode === "html"} onClick={() => mode === "visual" && toHtml()}>HTML</button>
  </div>;
  if (mode === "html") return <div className={c.editorFrame}>
    <div className={c.toolbar}><span className={c.htmlNote}>Editing HTML. Unsupported tags are removed when you save.</span><span className={c.toolSpacer} />{modes}</div>
    <textarea className={c.htmlSource} value={source} spellCheck={false} aria-label={`${label} HTML`} rows={Math.min(24, Math.max(8, source.split("\n").length + 1))}
      onChange={(event) => { setSource(event.target.value); onChange(event.target.value.trim()); }} />
  </div>;
  const run = (action: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>) => action(editor.chain().focus()).run();
  return <div className={c.editorFrame}>
    <div className={c.toolbar} role="toolbar" aria-label={`${label} formatting`}>
      {!minimal && <><ToolButton icon="h2" label="Heading" active={state.h2} onClick={() => run((chain) => chain.toggleHeading({ level: 2 }))} /><ToolButton icon="h3" label="Subheading" active={state.h3} onClick={() => run((chain) => chain.toggleHeading({ level: 3 }))} /><span className={c.toolDivider} /></>}
      <ToolButton icon="bold" label="Bold" active={state.bold} onClick={() => run((chain) => chain.toggleBold())} />
      <ToolButton icon="italic" label="Italic" active={state.italic} onClick={() => run((chain) => chain.toggleItalic())} />
      <ToolButton icon="underline" label="Underline" active={state.underline} onClick={() => run((chain) => chain.toggleUnderline())} />
      <ToolButton icon="strike" label="Strikethrough" active={state.strike} onClick={() => run((chain) => chain.toggleStrike())} />
      <span className={c.toolDivider} />
      <ToolButton icon="list" label="Bulleted list" active={state.bullet} onClick={() => run((chain) => chain.toggleBulletList())} />
      <ToolButton icon="ordered" label="Numbered list" active={state.ordered} onClick={() => run((chain) => chain.toggleOrderedList())} />
      {!minimal && <ToolButton icon="quote" label="Quote" active={state.quote} onClick={() => run((chain) => chain.toggleBlockquote())} />}
      <span className={c.toolDivider} />
      <ToolButton icon="link" label="Add link" active={state.link} onClick={() => setLinking(true)} />
      {state.link && <ToolButton icon="unlink" label="Remove link" onClick={() => run((chain) => chain.extendMarkRange("link").unsetLink())} />}
      {!minimal && <><ToolButton icon="image" label="Insert image" onClick={() => setPicking(true)} /><ToolButton icon="rule" label="Divider" onClick={() => run((chain) => chain.setHorizontalRule())} /></>}
      <span className={c.toolSpacer} />
      <ToolButton icon="undo" label="Undo" disabled={!state.undo} onClick={() => run((chain) => chain.undo())} />
      <ToolButton icon="redo" label="Redo" disabled={!state.redo} onClick={() => run((chain) => chain.redo())} />
      <span className={c.toolDivider} />
      {modes}
    </div>
    {linking && <LinkBar editor={editor} close={() => setLinking(false)} />}
    <EditorContent editor={editor} />
    {picking && <MediaPicker title="Insert an image" close={() => setPicking(false)} choose={(item) => editor.chain().focus().setImage({ src: item.url, alt: item.alt }).run()} />}
  </div>;
}
