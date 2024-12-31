import { api } from "@/trpc/server";

export default async function SchedulePreloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await api.catalyst.school.get.draft.periods.prefetch();
  await api.catalyst.school.get.draft.schedules.prefetch();

  return children;
}
