## Minimal change to existing route.ts

Replace the short `NICHES` const with:

```ts
import { NICHE_SELECT_OPTIONS } from "@/lib/nicheBlueprints";
import { toLegacyNicheId, toBlueprintId } from "@/lib/nicheCompat";

const ALLOWED = new Set([
  ...NICHE_SELECT_OPTIONS.map((n) => n.id),
  // legacy ids still accepted
  "restaurant_food", "beauty_salon", "ecommerce_retail",
  "creative_portfolio", "legal_professional", "education",
]);
```

When validating:
```ts
const nicheRaw = String(body.niche || "general_business");
const niche = ALLOWED.has(nicheRaw) ? nicheRaw : "general_business";
const blueprintId = toBlueprintId(niche);
const legacyId = toLegacyNicheId(blueprintId);
```

Inject into profile before generateSite (soft hint for detection + images):
```ts
// thin bio boost for detectNiche keywords
if ((profile.bio || "").length < 40) {
  profile.bio = `${profile.bio || profile.name}\n${blueprintId.replace(/_/g, " ")}`.trim();
}
// optional: (profile as any).nicheHint = blueprintId;
```

Do **not** remove enrich / templateProfile / brandColor / logo logic.
