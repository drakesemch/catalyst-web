import { api, HydrateClient } from "@/trpc/server";
import { ScheduleClientPage } from "./client";

export default async function SchedulePage() {
  await api.catalyst.user.canvas.schedule.current.prefetch();

  return (
    <HydrateClient>
      <ScheduleClientPage />
    </HydrateClient>
  );
}
