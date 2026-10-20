/**
 * Dummy / fallback imagery for LinkedIn–CV professional sites.
 * Used when profile.photoUrl is missing (URL stub, parse without photo).
 * Prefer real CV/LinkedIn photos when present.
 */

export type ProMediaSet = {
  /** Hero / about portrait */
  portrait: string[];
  /** Workspace / desk / meeting */
  workspace: string[];
  /** Lifestyle / speaking / outdoor brand */
  lifestyle: string[];
};

function u(id: string, w = 900): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Shared high-quality portrait pool (diverse, editorial) */
const PORTRAITS_GENERAL = [
  u("photo-1560250097-0b93528c311a"), // professional man suit
  u("photo-1573496359142-b8d87734a5a2"), // professional woman
  u("photo-1580489944761-15a19d654956"), // woman portrait
  u("photo-1519085360753-af0119f7cbe7"), // man blazer
  u("photo-1594744803329-e58b31de8bf5"), // woman professional
  u("photo-1472099645785-5658abf4ff4e"), // man friendly
  u("photo-1438761681033-6461ffad8d80"), // woman smile
  u("photo-1507003211169-0a1dd7228f2d"), // man portrait
];

const WORKSPACE = [
  u("photo-1497366216548-37526070297c", 1200),
  u("photo-1522071820081-009f0129c71c", 1200),
  u("photo-1497215728101-856f4ea42174", 1200),
  u("photo-1460925895917-afdab827c52f", 1200),
  u("photo-1556761175-b413da4baf72", 1200),
  u("photo-1486312338219-ce68d2c6f44d", 1200),
];

const LIFESTYLE = [
  u("photo-1543269865-cbf427effbad", 1200),
  u("photo-1521737711867-e3b97375f902", 1200),
  u("photo-1552664730-d307ca884978", 1200),
  u("photo-1517245386807-bb43f82c33c4", 1200),
  u("photo-1573164713714-d95e436ab8d6", 1200),
  u("photo-1551836022-d5d88e9218df", 1200),
];

const BY_PERSONA: Record<string, ProMediaSet> = {
  consultant: {
    portrait: [
      u("photo-1560250097-0b93528c311a"),
      u("photo-1573496359142-b8d87734a5a2"),
      u("photo-1519085360753-af0119f7cbe7"),
      u("photo-1594744803329-e58b31de8bf5"),
      ...PORTRAITS_GENERAL.slice(0, 4),
    ],
    workspace: WORKSPACE,
    lifestyle: LIFESTYLE,
  },
  engineer: {
    portrait: [
      u("photo-1507003211169-0a1dd7228f2d"),
      u("photo-1472099645785-5658abf4ff4e"),
      u("photo-1539571696357-5a69c17a67c6"),
      u("photo-1500648767791-00dcc994a43e"),
      ...PORTRAITS_GENERAL.slice(0, 4),
    ],
    workspace: [
      u("photo-1517694712202-14dd9538aa97", 1200),
      u("photo-1461749280684-dccba630e2f6", 1200),
      u("photo-1498050108023-c5249f4df085", 1200),
      ...WORKSPACE,
    ],
    lifestyle: LIFESTYLE,
  },
  designer: {
    portrait: [
      u("photo-1438761681033-6461ffad8d80"),
      u("photo-1534528741775-53994a69daeb"),
      u("photo-1529626455594-4ff0802cfb7e"),
      u("photo-1524504388940-b1c1722653e1"),
      ...PORTRAITS_GENERAL.slice(0, 4),
    ],
    workspace: [
      u("photo-1561070791-2526d30994b5", 1200),
      u("photo-1558655146-d09347e92766", 1200),
      u("photo-1586717791821-3f44a563fa4c", 1200),
      ...WORKSPACE,
    ],
    lifestyle: LIFESTYLE,
  },
  founder: {
    portrait: PORTRAITS_GENERAL,
    workspace: WORKSPACE,
    lifestyle: LIFESTYLE,
  },
  lawyer: {
    portrait: [
      u("photo-1556157382-97eda2d62296"),
      u("photo-1560250097-0b93528c311a"),
      u("photo-1573496359142-b8d87734a5a2"),
      ...PORTRAITS_GENERAL.slice(0, 4),
    ],
    workspace: [
      u("photo-1589829545856-d10d557cf95f", 1200),
      u("photo-1505664194779-8beaceb93744", 1200),
      ...WORKSPACE,
    ],
    lifestyle: LIFESTYLE,
  },
  marketer: {
    portrait: PORTRAITS_GENERAL,
    workspace: [
      u("photo-1552664730-d307ca884978", 1200),
      u("photo-1460925895917-afdab827c52f", 1200),
      ...WORKSPACE,
    ],
    lifestyle: LIFESTYLE,
  },
  creator: {
    portrait: [
      u("photo-1539571696357-5a69c17a67c6"),
      u("photo-1524504388940-b1c1722653e1"),
      u("photo-1501196354221-bf185135cd65"),
      ...PORTRAITS_GENERAL,
    ],
    workspace: [
      u("photo-1492691527719-9d1e07e534b4", 1200),
      u("photo-1516035069371-29a1b244cc32", 1200),
      ...WORKSPACE,
    ],
    lifestyle: [
      u("photo-1470071459604-3b5ec3a7fe05", 1200),
      u("photo-1500530855697-b586d89ba3ee", 1200),
      ...LIFESTYLE,
    ],
  },
  general: {
    portrait: PORTRAITS_GENERAL,
    workspace: WORKSPACE,
    lifestyle: LIFESTYLE,
  },
};

function hashPick(seed: string, len: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return len ? h % len : 0;
}

export function mediaForPersona(persona?: string | null): ProMediaSet {
  const key = (persona || "general") as string;
  return BY_PERSONA[key] || BY_PERSONA.general;
}

/** Stable portrait for a profile name (same person → same dummy) */
export function pickPortrait(fullName: string, persona?: string | null): string {
  const set = mediaForPersona(persona);
  const list = set.portrait;
  return list[hashPick(fullName || "pro", list.length)] || list[0];
}

export function pickWorkspace(fullName: string, persona?: string | null): string {
  const set = mediaForPersona(persona);
  const list = set.workspace;
  return list[hashPick((fullName || "pro") + "ws", list.length)] || list[0];
}

/** 3–6 gallery images for about / home strip */
export function pickGallery(fullName: string, persona?: string | null, n = 6): string[] {
  const set = mediaForPersona(persona);
  const pool = [...set.workspace, ...set.lifestyle, ...set.portrait];
  const out: string[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool[hashPick((fullName || "pro") + i, pool.length)]);
  }
  return out;
}
