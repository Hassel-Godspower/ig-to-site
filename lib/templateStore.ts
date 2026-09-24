/**
 * User section templates — localStorage + optional Supabase storage mirror.
 * Keyed per browser; job-agnostic so templates work across sites.
 */

export type StoredTemplate = {
  id: string;
  name: string;
  html: string;
  createdAt: string;
  category?: string;
};

const LS_KEY = "goke_section_templates_v1";

export function listTemplates(): StoredTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as StoredTemplate[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveTemplate(tpl: StoredTemplate): StoredTemplate[] {
  const all = listTemplates().filter((t) => t.id !== tpl.id);
  all.unshift(tpl);
  localStorage.setItem(LS_KEY, JSON.stringify(all.slice(0, 50)));
  return all;
}

export function deleteTemplate(id: string): StoredTemplate[] {
  const all = listTemplates().filter((t) => t.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  return all;
}

export function getTemplate(id: string): StoredTemplate | null {
  return listTemplates().find((t) => t.id === id) ?? null;
}
