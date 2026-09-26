/**
 * Load first-party Gòke main templates from /public/goke-templates/.
 * - Inlines linked CSS so styles work in the editor iframe (no path/base issues)
 * - Decorates DOM with data-goke markers so Properties / Image upload work
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
      `Failed to load Gòke template "${template.id}" (${res.status}).`
    );
  }

  let html = await res.text();
  html = await inlineStylesheets(html, template.basePath);
  html = injectBaseHref(html, template.basePath);
  html = decorateForEditor(html);
  html = html.replace(/<!--\[if lt IE 9\]>[\s\S]*?<!\[endif\]-->/gi, "");

  return { html, template };
}

function injectBaseHref(html: string, base: string): string {
  const baseTag = `<base href="${base}">`;
  html = html.replace(/<base\b[^>]*>/gi, "");
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}`);
  }
  return `<!DOCTYPE html><html><head>${baseTag}</head><body>${html}</body></html>`;
}

/**
 * Fetch each <link rel=stylesheet> under the template and embed as <style>.
 * Fixes blank unstyled canvas when relative CSS fails in the iframe.
 */
async function inlineStylesheets(html: string, basePath: string): Promise<string> {
  const linkRe =
    /<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi;
  const hrefRe = /href=["']([^"']+)["']/i;
  const links = html.match(linkRe) || [];
  const chunks: string[] = [];

  for (const tag of links) {
    const m = tag.match(hrefRe);
    if (!m) continue;
    let href = m[1];
    if (href.startsWith("http") || href.startsWith("//")) continue;
    if (href.startsWith("/")) {
      /* absolute on site */
    } else {
      href = basePath.replace(/\/?$/, "/") + href.replace(/^\.\//, "");
    }
    try {
      const r = await fetch(href, { credentials: "same-origin" });
      if (r.ok) {
        const css = await r.text();
        chunks.push(`/* inlined ${href} */\n${css}`);
      }
    } catch {
      /* keep external link as fallback */
    }
  }

  if (chunks.length === 0) return html;

  // Remove local stylesheet links we inlined (keep remote CDNs)
  html = html.replace(linkRe, (tag) => {
    const m = tag.match(hrefRe);
    if (!m) return tag;
    const href = m[1];
    if (href.startsWith("http") || href.startsWith("//")) return tag;
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

/**
 * Mark common elements so registry + PropertiesPanel + ImageField work.
 * Templates ship as plain HTML without data-goke attributes.
 */
export function decorateForEditor(html: string): string {
  if (typeof DOMParser === "undefined") {
    // SSR safety — decoration runs in the browser when applying templates
    return html;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const mark = (el: Element, value: string) => {
      if (!el.hasAttribute("data-goke")) {
        el.setAttribute("data-goke", value);
      }
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

    // Prefer full document string
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}
