/**
 * Load a first-party Gòke main template from /public/goke-templates/.
 * Separate from CDN starters (load-starter.ts).
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
  html = injectBaseHref(html, template.basePath);
  html = html.replace(/<!--\[if lt IE 9\]>[\s\S]*?<!\[endif\]-->/gi, "");

  return { html, template };
}

function injectBaseHref(html: string, base: string): string {
  const baseTag = `<base href="${base}">`;
  html = html.replace(/<base\b[^>]*>/gi, "");
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
  }
  return `<!DOCTYPE html><html><head>${baseTag}</head><body>${html}</body></html>`;
}
