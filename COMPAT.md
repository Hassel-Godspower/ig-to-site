# Compatibility: goke-linkedin-cv ↔ ig-to-site-main (44)

## Verdict: **Compatible with wiring (this pack does the wiring)**

| Check | Result |
|-------|--------|
| Path collisions | **None** — only new files under `lib/*professional*`, `lib/jsonResume.ts`, `lib/parseCvPdf.ts`, `lib/linkedinEnrich.ts`, `app/api/generate-professional`, `ProfessionalUpload.tsx` |
| Imports | Uses existing `@/lib/jobStore`, `@/lib/siteStore`, `nanoid` — same as `generate-handle` |
| Job shape | `createJob({ id, status: "draft", parsedUsername, editorMode: "simple", customerName?, phone?, email? })` with fallback if columns missing |
| Site files | `saveSiteFiles` + `editor-meta.json` — same pattern as handle path |
| Editor | HTML stamped with `data-goke` hooks; opens `/preview-simple/[jobId]` (simple mode) |
| package.json | **Must** `npm install pdf-parse` — not in main deps today |
| Env | Optional `PROXYCURL_API_KEY` |

## Gaps in the *unwired* zip (goke-linkedin-cv-2)

1. Returned files in JSON only — **did not** call `createJob` / `saveSiteFiles`
2. No `data-goke` stamp for editor
3. No homepage integration instruction beyond a component

**This compatible pack fixes (1)–(2).** You still add `<ProfessionalUpload />` on the homepage.

## Do not conflict with

- IG generate / generate-handle
- Commerce / booking runtimes on business sites (professional sites use a separate shell)
- Existing niches (professional path does not use extractCatalog)
