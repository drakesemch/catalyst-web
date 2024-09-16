"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export type NotificationMeta = {
  id: string;
  data: { type: "friendRequest"; user: string };
};

export function Notification({
  notification,
}: {
  notification: NotificationMeta;
}) {
  switch (notification.data.type) {
    case "friendRequest":
      return <FriendRequestNotification notification={notification} />;
    default:
      return <>some notification ({notification.data.type})</>;
  }
}

function FriendRequestNotification({
  notification,
}: {
  notification: { data: { user: string } };
}) {
  const [user] = api.catalyst.user.friends.request.getDetails.useSuspenseQuery({
    id: notification.data.user,
  });
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <div className="aspect-square rounded-full bg-primary" />
        <span className="font-bold">Friend Request</span>
      </div>
      <div className="flex items-center gap-2">
        <span>{user?.name}</span>
        <Button
          variant="secondary"
          href={`/app/users/${notification.data.user}`}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}
