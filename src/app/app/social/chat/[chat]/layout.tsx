import { api } from "@/trpc/server";

export default async function ChatLayout({
  params,
  children,
}: {
  params: Promise<{ chat: string }>;
  children: React.ReactNode;
}) {
  const chatId = (await params).chat;
  try {
    await api.catalyst.user.social.messages.list({ chatId, limit: 1 });
  } catch (err) {
    if ((err as { message: string }).message == "Group not found") {
      return (
        <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
          <h1 className="h1">Chat</h1>
          <div className="text-xs text-muted-foreground">
            This chat does not exist.
          </div>
        </main>
      );
    } else if (
      (err as { message: string }).message ==
      "You are not a member of this group"
    ) {
      return (
        <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
          <h1 className="h1">Chat</h1>
          <div className="text-xs text-muted-foreground">
            You are not a member of this group.
          </div>
        </main>
      );
    }
  }
  await api.catalyst.user.social.messages.list.prefetch({ chatId, limit: 30 });
  return children;
}
