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
      <div className="mx-auto flex h-[calc((100vh-4.5rem-1px))] w-full flex-col overflow-auto md:flex-row md:justify-center">
        <div className="flex min-h-96 w-full flex-1 flex-col gap-2 overflow-auto border-b p-4 md:w-[40ch] md:max-w-[40ch] md:border-r">
          <Messages />
        </div>
        <main className="max-w-[100ch] flex-1">{children}</main>
      </div>
    </HydrateClient>
  );
}
