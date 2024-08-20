import { api } from "@/trpc/server";

export default async function CanvasPreload({
  children,
}: {
  children: React.ReactNode;
}) {
  await api.catalyst.user.settings.get.prefetch();
  await api.catalyst.user.canvas.courses.prefetch();
  await api.catalyst.user.schedule.values.get.prefetch();
  const settings = await api.catalyst.user.settings.get();
  await api.catalyst.school.get.draft.details.prefetch({
    id: settings?.find((s) => s.key == "school_id")?.value ?? "",
  });
  return children;
}
