import { api } from "@/trpc/server";
import { UserRound } from "lucide-react";
import { UserActions } from "./client";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const user = await api.catalyst.user.friends.request.getDetails({ id });

  await api.catalyst.user.friends.list.prefetch();
  await api.catalyst.user.friends.request.incoming.prefetch({ limit: 100 });
  await api.catalyst.user.friends.request.outgoing.prefetch({ limit: 100 });

  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">
        <div className="h1 flex items-center gap-4">
          <UserRound />
          <div className="flex flex-col">
            <h1>{user?.name ?? "User Not Found"}</h1>
            <h2 className="text-lg font-medium text-muted-foreground">
              {user?.email ?? "user@example.com"}
            </h2>
          </div>
        </div>
        <h3 className="h2">Actions</h3>
        <div className="flex gap-2">
          <UserActions id={id} email={user?.email ?? "user@example.com"} />
        </div>
      </div>
    </main>
  );
}
