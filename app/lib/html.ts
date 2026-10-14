import sanitizeHtml from "sanitize-html";

/** Rich text from the admin editor is cleaned on save, so only formatting tags, links and images reach the site. */
export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "figure", "figcaption", "img", "br", "hr", "code", "pre"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      // Links that open in a new tab must not expose this page to the one they open.
      a: (tagName, attribs) => ({ tagName, attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs }),
    },
  }).trim();
}

/** Visible text of some HTML, for excerpts and search descriptions. */
export const plainText = (html: string) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
