import { api, HydrateClient } from "@/trpc/server";
import { TimerClientPage } from "./client";

export default async function TimerPage() {
    await api.catalyst.user.canvas.schedule.current.prefetch();

    return (
        <HydrateClient>
            <TimerClientPage />
        </HydrateClient>
    );
}
