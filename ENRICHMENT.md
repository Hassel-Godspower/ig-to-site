# What we extract from reference repos (intentional)

## 1. jsonresume/resume-schema (now packages/schema in jsonresume.org)

**Extract — do not fork the whole schema package unless you want validation later.**

| Concept | How gòke uses it |
|---------|------------------|
| `basics` | name, label→headline, summary→about, email, phone, image, url |
| `work[]` | position→title, name→company, highlights→bullets (impact, not walls of text) |
| `education[]` | institution, studyType, area, dates |
| `skills[]` | prefer `keywords[]` arrays; group as “Core” |
| `projects[]` | selected work, not every job |
| `certificates[]` | cert list |
| `profiles[]` | LinkedIn URL network entry |

**Implemented in** `lib/jsonResume.ts`:
- `professionalToJsonResume` → emits `resume.json` in the site bundle
- `jsonResumeToProfessional` → future import of JSON Resume files

**Why:** One structured career document → many outputs (site, later PDF export, ATS tools).

## 2. jsonresume.org themes

**Extract ideas, not theme packages (Handlebars/React themes are a different runtime).**

| Theme idea | gòke professional site |
|------------|-------------------------|
| Section order control | Fixed IA: Home → About → Experience → Skills → Contact |
| Highlight bullets | Experience cards use bullet lists only |
| Accent + typography tokens | CSS variables in `generateProfessionalSite` |
| Single data file | `profile.json` + `resume.json` |

**Not extracting:** Full theme marketplace — gòke already has a visual editor.

## 3. AmruthPillai / reactive-resume

**Extract UX patterns; do not embed the monorepo (Postgres, Hono, PDF printer, auth).**

| Pattern | gòke application |
|---------|------------------|
| Section-centric editing | Already matches gòke Structure panel + `data-goke` |
| Timeline / work items with highlights | Experience cards |
| Skills as tags | `.skills span` chips |
| Browser PDF later | Optional v2 via `pdfjs-dist` for *preview of uploaded CV*, not required for v1 |
| Import JSON Resume | `jsonResumeToProfessional` ready |

**Not extracting:** Their full builder — would duplicate gòke editor.

## 4. mozilla/pdf.js

**v1:** stay on `pdf-parse` (Node, fast enough for text CVs).  
**v2:** `pdfjs-dist` if you need:
- client-side page preview of the uploaded CV
- better handling of some complex PDFs

Scanned (image-only) PDFs still need OCR — out of scope unless you add an OCR API.

## Architecture principle (same as IG path)

```
Input adapters (LinkedIn API | PDF | JSON Resume)
        ↓
  ProfessionalProfile  (internal)
        ↓
  generateProfessionalSite  → static HTML
        ↓
  jobStore + siteStore + editor + publish
```

Every input becomes one schema. The editor never cares whether data came from Proxycurl or a PDF.
