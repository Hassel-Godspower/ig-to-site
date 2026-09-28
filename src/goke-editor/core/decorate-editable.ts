/**
 * Mark plain template DOM so the editor can map nodes → Content properties.
 * Used for Gòke packs, CDN starters, and generated HTML.
 */

export function decorateEditableHtml(html: string): string {
  if (typeof DOMParser === "undefined") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    decorateEditableDocument(doc);
    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}

export function decorateEditableDocument(doc: Document): void {
  const mark = (el: Element, value: string, force = false) => {
    if (force || !el.hasAttribute("data-goke")) {
      el.setAttribute("data-goke", value);
    }
  };

  doc.querySelectorAll("section").forEach((el) => mark(el, "section"));
  doc.querySelectorAll("header, footer, main, nav").forEach((el) =>
    mark(el, "container")
  );
  doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) =>
    mark(el, "heading")
  );
  doc.querySelectorAll("p, li, label, figcaption").forEach((el) => {
    if (el.closest("button, a.btn, .btn, [data-goke='button']")) return;
    mark(el, "text");
  });
  doc.querySelectorAll("img").forEach((el) => mark(el, "image"));
  doc.querySelectorAll("video, source").forEach((el) => {
    if (el.tagName.toLowerCase() === "video") mark(el, "image");
  });

  // Buttons & CTAs
  doc
    .querySelectorAll(
      "a.btn, a.button, button, .btn, .button, [class*='btn-'], .navbar-toggler, .nav-toggle, .menu-toggle, summary"
    )
    .forEach((el) => mark(el, "button", true));

  // Nav + normal links (not already buttons)
  doc.querySelectorAll("a[href]").forEach((el) => {
    if (el.getAttribute("data-goke") === "button") return;
    if (el.classList.contains("btn") || el.classList.contains("button")) return;
    mark(el, "link");
  });

  doc.querySelectorAll("input, textarea, select").forEach((el) => {
    const type = (el.getAttribute("type") || "").toLowerCase();
    if (type === "checkbox" || type === "radio") mark(el, "input");
    else if (el.tagName === "TEXTAREA") mark(el, "textarea");
    else mark(el, "input");
  });
  doc.querySelectorAll("form").forEach((el) => mark(el, "form"));

  // Bootstrap-style toggles
  doc
    .querySelectorAll("[data-bs-toggle], [data-toggle], .dropdown-toggle")
    .forEach((el) => mark(el, "button", true));
}
