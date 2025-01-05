"use client";

import type { NotificationMeta } from "@/components/catalyst/app/notifications";
import { RealtimeContext } from "@/components/catalyst/app/realtime-provider";
import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import { Check, Loader, Shield, X } from "lucide-react";
import { useMemo, useEffect, useContext, useRef } from "react"; // Import useMemo and useEffect
import type { Friend } from "../client";

type IncomingFriendRequest =
  RouterOutputs["catalyst"]["user"]["friends"]["request"]["incoming"][number];

export function IncomingRequests() {
  const { data: requests } =
    api.catalyst.user.friends.request.incoming.useQuery({
      limit: 100,
    });

  return (
    <div className="flex flex-col gap-2">
      {requests?.map((request) => (
        <IncomingRequest key={request.relationship.id} request={request} />
      ))}
    </div>
  );
}

export function OutgoingRequests() {
  const { data: requests } =
    api.catalyst.user.friends.request.outgoing.useQuery({
      limit: 100,
    });

  return (
    <div className="flex flex-col gap-2">
      {requests?.map((request) => (
        <OutgoingRequest key={request.relationship.id} request={request} />
      ))}
    </div>
  );
}

function IncomingRequest({ request }: { request: IncomingFriendRequest }) {
  const utils = api.useUtils();
  const { channel } = useContext(RealtimeContext);

  const {
    data: chatId,
    mutate: accept,
    isPending: acceptIsPending,
    isSuccess: acceptIsSuccess,
  } = api.catalyst.user.friends.request.accept.useMutation();
  const {
    mutate: decline,
    isPending: declineIsPending,
    isSuccess: declineIsSuccess,
  } = api.catalyst.user.friends.request.decline.useMutation();
  const {
    mutate: block,
    isPending: blockIsPending,
    isSuccess: blockIsSuccess,
  } = api.catalyst.user.friends.request.block.useMutation();
  const isPending = useMemo(
    () => acceptIsPending || declineIsPending || blockIsPending,
    [acceptIsPending, declineIsPending, blockIsPending],
  );

  const exisingEmails = useRef(new Set<string>());

  useEffect(() => {
    if (!channel) return;
    (async () => {
      await channel.subscribe("notification", (message) => {
        const data = message.data as NotificationMeta["data"];
        if (data.type === "catalyst.friend-request") {
          if (exisingEmails.current.has(data.data.user.email)) return;
          exisingEmails.current.add(data.data.user.email);
          utils.catalyst.user.friends.request.incoming.setData(
            { limit: 5 },
            (requests) => [
              ...(requests ?? []),
              {
                user: data.data.user,
                relationship: {
                  state: "requested",
                },
              } as IncomingFriendRequest,
            ],
          );
        }
        if (data.type === "catalyst.friend-added") {
          utils.catalyst.user.friends.list.setData(undefined, (friends) => [
            ...(friends ?? []),
            {
              user: data.data.user,
              relationship: {
                ...data.data.relationship,
                state: "friends" as const,
              },
            } as Friend,
          ]);
        }
      });
    })().catch(console.error);
  }, [
    channel,
    utils.catalyst.user.friends.list,
    utils.catalyst.user.friends.request.incoming,
  ]);

  useEffect(() => {
    if (!acceptIsSuccess || !chatId) return;
    utils.catalyst.user.friends.list.setData(undefined, (friends) => [
      ...(friends ?? []),
      {
        user: request.user,
        relationship: {
          ...request.relationship,
          defaultChatId: chatId,
        },
      },
    ]);
  }, [
    chatId,
    acceptIsSuccess,
    request.relationship,
    request.user,
    request.user.email,
    utils.catalyst.user.friends.list,
  ]);

  useEffect(() => {
    if (!(acceptIsSuccess || declineIsSuccess || blockIsSuccess)) return;
    utils.catalyst.user.friends.request.incoming.setData(
      { limit: 5 },
      (requests) =>
        requests?.filter((r) => r.relationship.id !== request.relationship.id),
    );
  }, [
    acceptIsSuccess,
    declineIsSuccess,
    blockIsSuccess,
    request.relationship,
    request.user.email,
    utils.catalyst.user.friends.list,
    utils.catalyst.user.friends.request.incoming,
  ]);

  return (
    <div className="flex items-center justify-between gap-2 border-b p-2">
      <div className="flex items-center gap-2">
        <UserAvatar
          name={request.user.name ?? ""}
          image={request.user.image ?? ""}
        />
        <div className="flex flex-col">
          <span>{request.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {request.user.email}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            block({ id: request.user.id });
          }}
          variant="destructive"
          disabled={isPending}
          className="flex-1"
        >
          {blockIsPending ? (
            <>
              <Loader className="animate-spin" /> Blocking...
            </>
          ) : (
            <>
              <Shield /> Block
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            decline({ id: request.user.id });
          }}
          variant="secondary"
          disabled={isPending}
          className="flex-1"
        >
          {declineIsPending ? (
            <>
              <Loader className="animate-spin" /> Declining...
            </>
          ) : (
            <>
              <X /> Decline
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            accept({ id: request.user.id });
          }}
          disabled={isPending}
          className="flex-1"
        >
          {acceptIsPending ? (
            <>
              <Loader className="animate-spin" /> Accepting...
            </>
          ) : (
            <>
              <Check /> Accept
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function OutgoingRequest({ request }: { request: IncomingFriendRequest }) {
  const utils = api.useUtils();

  const {
    mutate: remove,
    isPending: removeIsPending,
    isSuccess: removeIsSuccess,
  } = api.catalyst.user.friends.request.remove.useMutation();

  const isPending = useMemo(() => removeIsPending, [removeIsPending]);

  useEffect(() => {
    if (!removeIsSuccess) return;
    utils.catalyst.user.friends.request.outgoing.setData(
      { limit: 5 },
      (requests) =>
        requests?.filter((r) => r.relationship.id !== request.relationship.id),
    );
  }, [
    removeIsSuccess,
    request.relationship.id,
    utils.catalyst.user.friends.request.outgoing,
  ]);

  return (
    <div className="flex items-center justify-between gap-2 border-b p-2">
      <div className="flex items-center gap-2">
        <UserAvatar
          name={request.user.name ?? ""}
          image={request.user.image ?? ""}
        />
        <div className="flex flex-col">
          <span>{request.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {request.user.email}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            remove({ id: request.user.id });
          }}
          variant="secondary"
          disabled={isPending}
          className="flex-1"
        >
          {removeIsPending ? (
            <>
              <Loader className="animate-spin" /> Removing...
            </>
          ) : (
            <>
              <X /> Remove
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
