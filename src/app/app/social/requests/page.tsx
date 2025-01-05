import { api } from "@/trpc/server";
import { IncomingRequests, OutgoingRequests } from "./client";

export default async function RequestsPage() {
  await api.catalyst.user.friends.request.incoming.prefetch({
    limit: 100,
  });
  await api.catalyst.user.friends.request.outgoing.prefetch({
    limit: 100,
  });

  return (
    <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
      <h1 className="h1">Requests</h1>
      <h2 className="h2">Incoming</h2>
      <IncomingRequests />
      <h2 className="h2" id="outgoing">
        Outgoing
      </h2>
      <OutgoingRequests />
    </main>
  );
}
