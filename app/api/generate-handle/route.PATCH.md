In app/api/generate-handle/route.ts:

```ts
import { NICHE_SELECT_OPTIONS } from "@/lib/nicheBlueprints";

const ALLOWED = new Set(NICHE_SELECT_OPTIONS.map((n) => n.id));
const niche = ALLOWED.has(nicheRaw) ? nicheRaw : "general_business";
(profile as { nicheHint?: string }).nicheHint = niche;
```
