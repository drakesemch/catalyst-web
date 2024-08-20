import { api } from "@/trpc/server";

export async function hasFinishedOnboarding() {
  const settings = await api.catalyst.user.settings.get();

  const keys = ["school_id", "canvas_token"];

  return (
    settings &&
    settings.length > 0 &&
    keys.every((key) =>
      settings.find((s) => s.key == key && s.draftState == "saved"),
    )
  );
}
