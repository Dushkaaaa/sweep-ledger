import { type LanguageCode } from "./translations";

export function getWorkspaceRoute(userId: string | null | undefined) {
  if (!userId) {
    return "/";
  }

  return `/u/${userId}`;
}
