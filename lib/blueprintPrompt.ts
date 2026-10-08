import {
  detectBlueprint,
  formatBlueprintForPrompt,
  type NicheBlueprint,
} from "./nicheBlueprints";
import { toBlueprintId } from "./nicheCompat";
import type { InstagramProfile } from "./parseInstagramExport";

export function resolveNicheBlueprint(
  profile: InstagramProfile & { nicheHint?: string }
): NicheBlueprint {
  const hint = profile.nicheHint
    ? toBlueprintId(profile.nicheHint)
    : undefined;
  return detectBlueprint({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    posts: profile.posts,
    nicheHint: hint,
  });
}

export function blueprintPromptSection(
  profile: InstagramProfile & { nicheHint?: string }
): string {
  return formatBlueprintForPrompt(resolveNicheBlueprint(profile));
}

export function pagesJsonFromBlueprint(bp: NicheBlueprint): string {
  return JSON.stringify(
    { pages: bp.requiredPages.map((p) => ({ file: p.file, title: p.title })) },
    null,
    2
  );
}
