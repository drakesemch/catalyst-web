import { expFriends } from "@/app/flags";
import {
  Friends,
  IncomingFriendRequests,
  FriendRequest,
  Groups,
} from "./client";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function SocialPage() {
  if (!(await expFriends())) {
    return (
      <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
        <h1 className="h1">Social</h1>
        <div className="text-xs text-muted-foreground">
          This feature is under development, and will be released soon.
        </div>
      </main>
    );
  }

  await api.catalyst.user.friends.list.prefetch();
  await api.catalyst.user.friends.request.incoming.prefetch({
    limit: 5,
  });

  return (
    <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
      <h1 className="h1">Social</h1>
      <h2 className="h2">Friends</h2>
      <Friends />
      <h3 className="h2">Friend Requests</h3>
      <div className="flex h-max flex-row gap-2 overflow-auto pb-2">
        <IncomingFriendRequests />
        <Card className="relative h-44 w-96 flex-shrink-0">
          <Button
            variant="ghost"
            className="absolute inset-0 h-auto"
            href="/app/social/requests"
          >
            <ArrowRight />
            <p>View All</p>
          </Button>
        </Card>
        <FriendRequest />
      </div>
      <h2 className="h2">Groups</h2>
      <Groups />
    </main>
  );
}
