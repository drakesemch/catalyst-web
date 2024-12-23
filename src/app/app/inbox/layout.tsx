import { HydrateClient, api } from "@/trpc/server";
import { Messages } from "./client";

export default async function InboxPage({
  children,
}: {
  children: React.ReactNode;
}) {
  await api.canvas.inbox.list.prefetchInfinite({
    limit: 50,
  });

  return (
    <HydrateClient>
      <div className="mx-auto flex h-[calc((100vh-4.5rem-1px))] w-full flex-col md:flex-row md:justify-center overflow-auto">
        <div className="flex w-full md:w-[40ch] md:max-w-[40ch] flex-col gap-2 overflow-auto border-b md:border-r p-4 flex-1 md:flex-[0] min-h-96">
          <Messages />
        </div>
        <main className="max-w-[100ch] flex-1">{children}</main>
      </div>
    </HydrateClient>
  );
}
