/**
 * Load first-party Gòke main templates from /public/goke-templates/.
 * Inlines CSS for reliable editor preview; decorates data-goke for editing.
 * Full pack (all pages + assets) is seeded into job storage via seed-template API.
 */

import type { GokeMainTemplate } from "../data/goke-main-templates";
import { findGokeMain } from "../data/goke-main-templates";

export type LoadGokeResult = {
  html: string;
  template: GokeMainTemplate;
};

export async function loadGokeMainHtml(
  idOrTemplate: string | GokeMainTemplate
): Promise<LoadGokeResult> {
  const template =
    typeof idOrTemplate === "string"
      ? findGokeMain(idOrTemplate)
      : idOrTemplate;

  if (!template) {
    throw new Error(`Unknown Gòke template: ${String(idOrTemplate)}`);
  }

  const res = await fetch(template.indexUrl, { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(
      `Failed to load Gòke template "${template.id}" (${res.status}). Is public/goke-templates/${template.folder} deployed?`
    );
  }

  let html = await res.text();
  html = await inlineStylesheets(html, template.basePath);
  html = injectBaseHref(html, template.basePath);
  html = decorateForEditor(html);
  html = html.replace(/<!--\[if lt IE 9\]>[\s\S]*?<!\[endif\]-->/gi, "");

  return { html, template };
}

/**
 * Copy entire template pack into job storage (multi-page + css + js + images).
 */
export async function seedGokeTemplateToJob(
  jobId: string,
  templateId: string
): Promise<{ files: string[] }> {
  const res = await fetch(`/api/site/${jobId}/seed-template`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Seed failed (${res.status})`);
  }
  return { files: data.files || [] };
}

function injectBaseHref(html: string, base: string): string {
  const baseTag = `<base href="${base}">`;
  html = html.replace(/<base\b[^>]*>/gi, "");
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}`);
  }
  return `<!DOCTYPE html><html><head>${baseTag}</head><body>${html}</body></html>`;
}

async function inlineStylesheets(
  html: string,
  basePath: string
): Promise<string> {
  const linkRe = /<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi;
  const hrefRe = /href=["']([^"']+)["']/i;
  const links = html.match(linkRe) || [];
  const chunks: string[] = [];

  for (const tag of links) {
    const m = tag.match(hrefRe);
    if (!m) continue;
    let href = m[1];
    if (/^https?:/i.test(href) || href.startsWith("//")) continue;

    // normalize bad prefixes
    href = href.replace(/^public\/goke-templates\/[^/]+\//, "");
    href = href.replace(/^\/goke-templates\/[^/]+\//, "");
    href = href.replace(/assets\/CSS\//g, "assets/css/");

    const candidates = [
      href.startsWith("/")
        ? href
        : basePath.replace(/\/?$/, "/") + href.replace(/^\.\//, ""),
      // case fallback
      (href.startsWith("/")
        ? href
        : basePath.replace(/\/?$/, "/") + href.replace(/^\.\//, "")
      ).replace(/assets\/css\//, "assets/CSS/"),
    ];

    for (const url of candidates) {
      try {
        const r = await fetch(url, { credentials: "same-origin" });
        if (r.ok) {
          chunks.push(`/* inlined ${url} */\n${await r.text()}`);
          break;
        }
      } catch {
        /* try next */
      }
    }
  }

  if (chunks.length === 0) return html;

  html = html.replace(linkRe, (tag) => {
    const m = tag.match(hrefRe);
    if (!m) return tag;
    const href = m[1];
    if (/^https?:/i.test(href) || href.startsWith("//")) return tag;
    return `<!-- inlined: ${href} -->`;
  });

  const styleBlock = `<style id="goke-template-css">\n${chunks.join(
    "\n\n"
  )}\n</style>`;
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleBlock}\n</head>`);
  }
  return styleBlock + html;
}

export function decorateForEditor(html: string): string {
  if (typeof DOMParser === "undefined") return html;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const mark = (el: Element, value: string) => {
      if (!el.hasAttribute("data-goke")) el.setAttribute("data-goke", value);
    };

    doc.querySelectorAll("section").forEach((el) => mark(el, "section"));
    doc.querySelectorAll("header, footer, nav, main").forEach((el) =>
      mark(el, "container")
    );
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) =>
      mark(el, "heading")
    );
    doc.querySelectorAll("p, li, span.lead, .lead").forEach((el) => {
      if (el.closest("button, a.btn, .btn")) return;
      mark(el, "text");
    });
    doc.querySelectorAll("img").forEach((el) => mark(el, "image"));
    doc
      .querySelectorAll("a.btn, a.button, button, .btn, .button")
      .forEach((el) => mark(el, "button"));
    doc.querySelectorAll("a[href]:not(.btn):not(.button)").forEach((el) => {
      if (!el.hasAttribute("data-goke")) mark(el, "link");
    });
    doc
      .querySelectorAll("input, textarea, select")
      .forEach((el) => mark(el, "input"));
    doc.querySelectorAll("form").forEach((el) => mark(el, "form"));

    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}
