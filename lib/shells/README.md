# Gòke Multi-Shell System

Each niche maps to a **distinct design shell** (structure + CSS + tokens).  
AI only writes copy/images JSON; the shell owns layout and visual DNA.

## Shells

| Shell | Reference | Niches |
|-------|-----------|--------|
| `sanctuary` | Pax & Pearl | spa_wellness, hair_salon |
| `sensorial` | Brandrich | restaurant_dining, cafe_coffee, bakery_pastry, bar_lounge, fast_food_qsr |
| `athletic` | iFitness | fitness_gym, coach_consultant |
| `authority` | Quiet professional | law_firm, accounting, real_estate, healthcare_clinic, dental_clinic |
| `editorial` | Campaign craft | fashion_boutique, african_wear, jewelry, photography, creative_agency |
| `hospitality` | Space-first luxury | hotel_stay, event_centre, short_let |
| `trade` | Industrial premium | auto_dealership, auto_mechanic, logistics, pharmacy, barber_shop |
| `clarity` | Modern product | tech_saas, school_education, church_faith, general_business |

## Files

```
lib/shells/
  registry.ts   # niche → shellId
  themes.ts     # unique tokens per shell
  types.ts      # ShellContent contract
  render.ts     # HTML + CSS per shell
  index.ts      # public exports
```

## Flow

1. Detect niche (`resolveNicheBlueprint` / `detectNiche`)
2. `shellIdForNiche(nicheId)`
3. AI fills `ShellContent` JSON
4. `themeForShell(shellId)` + `renderShellById(shellId, content)`
5. Output unique `styles.css` + page HTML (`data-shell="..."`)

## Integrate

Copy `lib/shells/` into the project and use the updated:

- `lib/generateSite.ts`
- `lib/premiumShell.ts` (content helpers only; rendering delegated to shells)
