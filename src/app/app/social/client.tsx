"use client";

import type { NotificationMeta } from "@/components/catalyst/app/notifications";
import { RealtimeContext } from "@/components/catalyst/app/realtime-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RouterOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import {
  AlertCircle,
  ArrowUp,
  Check,
  Loader,
  MessageCircle,
  Plus,
  Send,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Friend =
  RouterOutputs["catalyst"]["user"]["friends"]["list"][number];
type IncomingFriendRequest =
  RouterOutputs["catalyst"]["user"]["friends"]["request"]["incoming"][number];

export function Friends() {
  const { data: friends } = api.catalyst.user.friends.list.useQuery();

  const utils = api.useUtils();
  const { channel } = useContext(RealtimeContext);

  useEffect(() => {
    if (!channel) return;
    (async () => {
      await channel.subscribe("notification", (message) => {
        const data = message.data as NotificationMeta["data"];
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
  }, [channel, utils.catalyst.user.friends]);

  return (
    <div className="flex flex-col gap-2">
      {friends?.length == 0 ? (
        <div className="flex h-44 w-full items-center justify-center text-xs text-muted-foreground">
          You have no friends (yet hopefully).
        </div>
      ) : (
        friends?.map((friend) => (
          <Card key={friend.user.email} className="flex flex-row gap-4">
            <CardHeader className="flex flex-1 flex-row items-center justify-start gap-6">
              <Avatar className="size-10">
                <AvatarImage src={friend.user.image ?? ""} />
                <AvatarFallback>
                  {(friend.user.email?.toUpperCase()[0] ?? "U") +
                    (friend.user.email?.toUpperCase()[1] ?? "N")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <CardTitle>{friend.user.name}</CardTitle>
                <CardDescription>{friend.user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex w-48 flex-col justify-center gap-2 p-2">
              <Button
                variant="outline"
                href={`/app/social/profile/${friend.user.id}`}
              >
                <UserRound />
                View Profile
              </Button>
              <Button
                href={`/app/social/chat/${friend.relationship.defaultChatId}`}
              >
                <MessageCircle />
                Chat
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export function Groups() {
  const { data: groups } = api.catalyst.user.social.groups.list.useQuery();

  return (
    <div className="flex flex-col gap-2">
      {groups?.length == 0 ? (
        <div className="flex h-44 w-full items-center justify-center text-xs text-muted-foreground">
          You are not in any groups.
        </div>
      ) : (
        groups?.map((group) => (
          <Card key={group.id} className="flex flex-row gap-4">
            <CardHeader className="flex flex-1 flex-row items-center justify-start gap-6">
              <Avatar className="size-10">
                <AvatarFallback>
                  {(group.name?.toUpperCase()[0] ?? "G") +
                    (group.name?.toUpperCase()[1] ?? "P")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <CardTitle>{group.name ?? "Group"}</CardTitle>
                <CardDescription>
                  {group.members
                    .map((mem) => mem.name)
                    .join(", ")
                    .replace(new RegExp(", $"), "")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex w-48 flex-col justify-center gap-2 p-2">
              <Button href={`/app/social/chat/${group.id}`}>
                <MessageCircle />
                Chat
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      <NewGroup />
    </div>
  );
}

function NewGroup() {
  const utils = api.useUtils();

  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const {
    mutate: createGroup,
    error,
    isError,
  } = api.catalyst.user.social.groups.create.useMutation({
    onSuccess: (chat) => {
      utils.catalyst.user.social.groups.list.setData(undefined, (groups) => [
        ...(groups ?? []),
        chat,
      ]);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Group</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {emails.length == 0 ? (
            <p className="flex h-10 items-center pl-6 text-xs text-muted-foreground">
              Add emails to create a group
            </p>
          ) : (
            <>
              {emails.map((email) => (
                <Button
                  key={email}
                  variant="secondary"
                  className="group flex flex-row gap-2 rounded-full border bg-secondary/50 p-2 pr-4"
                  onClick={() => {
                    setEmails(emails.filter((e) => e !== email));
                  }}
                >
                  <div className="relative w-6">
                    <Avatar className="absolute -mt-3 size-6 opacity-100 transition-opacity group-hover:opacity-0">
                      <AvatarFallback className="h-6 w-6 text-[0.5rem]">
                        {(email?.toUpperCase()[0] ?? "E") +
                          (email?.toUpperCase()[1] ?? "M")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute z-10 -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <X />
                    </div>
                  </div>
                  <span>{email}</span>
                </Button>
              ))}
              {emails.length <= 1 && (
                <p className="flex h-10 items-center pl-6 text-xs text-muted-foreground">
                  Add another email to create a group
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            onKeyDown={(evt) => {
              if (email.trim() == "") return;
              if (evt.key == "Enter") {
                setEmails([...emails, email]);
                setEmail("");
              }
              if (evt.key == "Tab") {
                evt.preventDefault();
                setEmails([...emails, email]);
                setEmail("");
              }
            }}
            placeholder="Email"
          />
          <Button
            variant="secondary"
            size="icon"
            className="flex-shrink-0"
            disabled={email.trim() == ""}
            onClick={() => {
              setEmails([...emails, email]);
            }}
          >
            <ArrowUp />
          </Button>
          <Button
            disabled={emails.length <= 1}
            onClick={() => {
              createGroup({ members: emails });
            }}
          >
            Create Group <Plus />
          </Button>
        </div>
        {isError && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle />
            {error?.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function IncomingFriendRequests() {
  const utils = api.useUtils();
  const { channel } = useContext(RealtimeContext);

  const { data: requests } =
    api.catalyst.user.friends.request.incoming.useQuery({
      limit: 5,
    });

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
      });
    })().catch(console.error);
  }, [channel, utils.catalyst.user.friends.request.incoming]);

  return requests?.length == 0 ? (
    <>
      <p className="flex h-44 w-96 flex-shrink-0 items-center justify-center text-xs text-muted-foreground">
        No incoming friend requests
      </p>
    </>
  ) : (
    requests
      ?.filter((_, idx) => idx >= (requests?.length ?? 0) - 5)
      ?.map((request) => (
        <IncomingFriendRequest
          key={request.relationship.relatedUserId}
          request={request}
        />
      ))
  );
}

export function IncomingFriendRequest({
  request,
}: {
  request: IncomingFriendRequest;
}) {
  const utils = api.useUtils();

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
    <Card
      key={request.user.email}
      className="flex h-44 w-96 flex-shrink-0 flex-col"
    >
      <CardHeader className="flex flex-1 flex-row items-center justify-start gap-6">
        <Avatar className="size-10">
          <AvatarImage src={request.user.image ?? ""} />
          <AvatarFallback>
            {(request.user.email?.toUpperCase()[0] ?? "U") +
              (request.user.email?.toUpperCase()[1] ?? "N")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-shrink flex-col gap-2 truncate">
          <CardTitle>
            <span className="max-w-full flex-1 truncate">
              {request.user.name}
            </span>
          </CardTitle>
          <CardDescription>
            <span className="max-w-full flex-1 truncate">
              {request.user.email}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row gap-2 pt-0">
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
      </CardContent>
    </Card>
  );
}

export function FriendRequest() {
  const [email, setEmail] = useState("");
  const {
    mutate: send,
    isPending,
    isSuccess,
    error,
    isError,
  } = api.catalyst.user.friends.request.send.useMutation();

  useEffect(() => {
    if (!isPending) setEmail("");
  }, [isPending]);

  return (
    <Card className="flex h-44 w-96 flex-shrink-0 flex-col">
      <CardHeader>
        <CardTitle>Send Friend Request</CardTitle>
        <CardDescription>
          {!isError ? (
            <Button
              href="/app/social/requests#outgoing"
              variant="link"
              className="h-auto p-0 pt-2"
            >
              View all outgoing requests
            </Button>
          ) : (
            <span className="flex items-center gap-1 pt-2 text-destructive">
              <AlertCircle />
              {error?.message}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-2">
        <Input
          placeholder="Email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") {
              send({ email: email });
            }
          }}
        />
        <Button
          onClick={() => {
            send({ email: email });
          }}
          disabled={isPending}
        >
          {(() => {
            if (isSuccess) {
              return (
                <>
                  Request Sent <Check />
                </>
              );
            } else if (isPending) {
              return (
                <>
                  Sending Request... <Loader className="animate-spin" />
                </>
              );
            } else {
              return (
                <>
                  Send Request <Send />
                </>
              );
            }
          })()}
        </Button>
      </CardContent>
    </Card>
  );
}
