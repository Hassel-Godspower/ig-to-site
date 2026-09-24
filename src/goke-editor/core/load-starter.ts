/**
 * Load a full-page starter from dawidolko/Website-Templates via jsDelivr.
 * Injects <base href="..."> so relative CSS/JS/img resolve on the CDN.
 */

import type { StarterTemplate } from "../data/starter-templates";
import { findStarter } from "../data/starter-templates";

export type LoadStarterResult = {
  html: string;
  template: StarterTemplate;
};

/**
 * Fetch index.html and prepare a document string safe to document.write()
 * into the editor iframe.
 */
export async function loadStarterHtml(
  idOrTemplate: string | StarterTemplate
): Promise<LoadStarterResult> {
  const template =
    typeof idOrTemplate === "string"
      ? findStarter(idOrTemplate)
      : idOrTemplate;

  if (!template) {
    throw new Error(`Unknown starter template: ${String(idOrTemplate)}`);
  }

  const res = await fetch(template.indexUrl, {
    mode: "cors",
    credentials: "omit",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to load template "${template.id}" (${res.status}). Check network / CDN.`
    );
  }

  let html = await res.text();
  html = injectBaseHref(html, template.cdnBase);
  html = stripScriptsThatBreakEditor(html);

  return { html, template };
}

/** Ensure a single <base href="cdnBase"> so relative assets resolve */
function injectBaseHref(html: string, cdnBase: string): string {
  const baseTag = `<base href="${cdnBase}">`;
  // Remove existing base tags
  html = html.replace(/<base\b[^>]*>/gi, "");
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(
      /<html([^>]*)>/i,
      `<html$1><head>${baseTag}</head>`
    );
  }
  return `<!DOCTYPE html><html><head>${baseTag}</head><body>${html}</body></html>`;
}

/**
 * Some templates load jQuery plugins that fight the editor's selection.
 * Keep CSS; drop only known-problematic inline bootstrap/jquery inits is hard,
 * so we leave scripts in place — they run in the iframe sandbox of the canvas.
 * Optionally strip document.write scripts that can blank the frame.
 */
function stripScriptsThatBreakEditor(html: string): string {
  // Remove conditional IE html5shim remote scripts that 404
  html = html.replace(
    /<!--\[if lt IE 9\]>[\s\S]*?<!\[endif\]-->/gi,
    ""
  );
  return html;
}

/**
 * Extract only <body> inner HTML for section-style insert (optional path).
 * Full-page replace should use loadStarterHtml + builder.setHtml.
 */
export function bodyInnerFromHtml(fullHtml: string): string {
  const m = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1].trim() : fullHtml;
}
