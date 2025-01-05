"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { MessageCircle, Shield, UserRoundPlus } from "lucide-react";

export function UserActions({ id, email }: { id: string; email: string }) {
  const { data: friends } = api.catalyst.user.friends.list.useQuery();

  const { data: requests } =
    api.catalyst.user.friends.request.incoming.useQuery({
      limit: 100,
    });

  const { mutate: requestFriend } =
    api.catalyst.user.friends.request.send.useMutation();
  const { mutate: acceptFriend } =
    api.catalyst.user.friends.request.accept.useMutation();
  const { mutate: blockFriend } =
    api.catalyst.user.friends.request.block.useMutation();

  if (friends?.find((f) => f.relationship.userId == id)) {
    return (
      <>
        <Button
          variant="outline"
          href={`/app/social/chat/${friends?.find((f) => f.relationship.userId == id)?.relationship.defaultChatId ?? ""}`}
          className="flex h-48 flex-1 flex-col items-center justify-center gap-4 text-xl"
        >
          <MessageCircle />
          Chat
        </Button>
        <Button
          variant="destructive"
          onClick={() => blockFriend({ id: id })}
          className="flex h-48 flex-1 flex-col items-center justify-center gap-4 text-xl"
        >
          <Shield />
          Block Friend
        </Button>
      </>
    );
  }

  if (requests?.find((f) => f.relationship.userId == id)) {
    return (
      <Button
        variant="outline"
        onClick={() => acceptFriend({ id: id })}
        className="flex h-48 flex-1 flex-col items-center justify-center gap-4 text-xl"
      >
        <UserRoundPlus />
        Accept Friend Request
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => requestFriend({ email: email })}
      className="flex h-48 flex-1 flex-col items-center justify-center gap-4 text-xl"
    >
      <UserRoundPlus />
      Request Friend
    </Button>
  );
}
