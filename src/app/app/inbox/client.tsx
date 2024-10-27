"use client";

import { UserAvatar } from "@/components/catalyst/user-avatar";
import { TextEditor } from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { formatDistanceStrict } from "date-fns";
import {
  Archive,
  Check,
  Forward,
  Loader,
  Reply,
  Search,
  Send,
  SortDesc,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Converter } from "showdown";

export function Messages() {
  const [{ pages }, { fetchNextPage, hasNextPage }] =
    api.canvas.inbox.list.useSuspenseInfiniteQuery(
      {
        limit: 50,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="h1">Inbox</h1>
      <div className="flex w-full gap-2">
        <label className="flex flex-1 flex-shrink items-center gap-2 overflow-hidden rounded-full border px-3 py-2 [&:has(input:focus-visible)]:outline">
          <Search />
          <input
            type="search"
            placeholder="Search messages..."
            className="min-w-0 flex-1 bg-background outline-none"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </label>
        <Button
          variant="outline"
          size="icon"
          className="flex-shrink-0 rounded-full"
        >
          <SortDesc />
        </Button>
      </div>
      <Separator className="mx-6 my-2 w-auto" />
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        end={<div>At end</div>}
      >
        {pages
          .flatMap((page) => page.data)
          .filter(
            (message) =>
              message.subject.toLowerCase().includes(search.toLowerCase()) ||
              message.last_message
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              message.participants?.some((user) =>
                user.full_name.toLowerCase().includes(search.toLowerCase()),
              ),
          )
          .filter(
            (message, idx) =>
              idx >
              (pages
                .flatMap((page) => page.data)
                .findIndex((msg) => msg.id == message.id) ?? -1),
          )
          .sort((a, b) =>
            Number(new Date(a.last_message_at)) >
            Number(new Date(b.last_message_at))
              ? -1
              : 1,
          )
          .map((message) => (
            <HoverCard key={message.id}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-auto flex-col gap-1 overflow-hidden"
                  href={`/app/inbox/${message.id}`}
                >
                  <h2 className="bold w-full overflow-hidden truncate text-left">
                    {message.subject}
                  </h2>
                  <p className="w-full overflow-hidden truncate text-left text-xs text-muted-foreground">
                    {
                      message.last_message.split(
                        "________________________________",
                      )[0]!
                    }
                  </p>
                  <p className="w-full max-w-full gap-1 overflow-hidden truncate text-left text-xs text-muted-foreground">
                    Sent{" "}
                    {formatDistanceStrict(
                      new Date(message.last_message_at),
                      now,
                      {
                        addSuffix: true,
                      },
                    )}{" "}
                    by{" "}
                    {message.participants
                      ?.map((user) =>
                        user.full_name
                          .split(" ")[0]!
                          .split("")
                          .map((letter, idx) =>
                            idx == 0
                              ? letter.toUpperCase()
                              : letter.toLowerCase(),
                          )
                          .join(""),
                      )
                      .reverse()
                      .map((name, idx) => (idx == 0 ? `and ${name}` : name))
                      .reverse()
                      .map((name, idx) => (idx == 1 ? `to ${name}` : name))
                      .join(", ")
                      .replace(", to and", " to")}
                  </p>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="start" className="w-96">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Reply />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Forward />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Archive />
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <h2 className="font-bold">Subject</h2>
                      <p className="text-muted-foreground">{message.subject}</p>
                    </div>
                    <div className="flex items-center gap-4 overflow-auto">
                      <h2 className="font-bold">Participants</h2>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        {message.participants?.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-1"
                          >
                            <UserAvatar
                              name={user.full_name ?? "Unknown"}
                              image={user.avatar_url}
                              className="size-8"
                            />
                            <div className="flex w-full flex-col overflow-hidden">
                              <div className="truncate">
                                {user.full_name
                                  .split(" ")
                                  .map((name) =>
                                    name
                                      .split("")
                                      .map((letter, idx) =>
                                        idx == 0
                                          ? letter.toUpperCase()
                                          : letter.toLowerCase(),
                                      )
                                      .join(""),
                                  )
                                  .join(" ") ?? "Unknown"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <h2 className="font-bold">Last Message</h2>
                      <p className="flex-1 text-muted-foreground">
                        {message.last_message}
                      </p>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
      </InfiniteScroll>
    </>
  );
}

function InfiniteScroll({
  next = () => {
    /**/
  },
  hasMore = true,
  loader = null,
  end = null,
  children,
  className,
}: {
  next: () => void;
  hasMore: boolean;
  loader: React.ReactNode;
  end: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const scrollingMessages = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(
    Number(
      typeof window != "undefined" && localStorage.getItem("scrollingMessages"),
    ) ?? 0,
  );
  const [isLoadingNewPage, setIsLoadingNewPage] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observedEl = useRef<HTMLDivElement[]>([]);
  const loadMoreDiv = useCallback((node: HTMLDivElement) => {
    setIsLoadingNewPage(false);
    observedEl.current.forEach((el) => {
      observer.current!.unobserve(el);
    });
    if (node !== null) {
      observer.current!.observe(node);
      observedEl.current.push(node);
    }
  }, []);

  const observer = useRef(
    typeof window !== "undefined"
      ? new IntersectionObserver((entries) => {
          setIsIntersecting(entries.some((entry) => entry.isIntersecting));
        })
      : undefined,
  );

  useEffect(() => {
    if (scrollingMessages.current) {
      scrollingMessages.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  useEffect(() => {
    if (!isIntersecting) return;
    setIsLoadingNewPage(true);
    next();
  }, [next, isIntersecting]);

  useEffect(() => {
    localStorage.setItem("scrollingMessages", String(scrollTop));
  }, [scrollTop]);

  return (
    <div
      className="max-h-full w-full overflow-auto"
      ref={scrollingMessages}
      onScroll={(evt) => {
        setScrollTop(evt.currentTarget.scrollTop);
      }}
    >
      <div className={cn("relative flex flex-col gap-1", className)}>
        {children}
        {hasMore && (
          <div
            key="load-more"
            ref={loadMoreDiv}
            className="absolute bottom-0 h-[80rem] w-0"
          />
        )}
        {isLoadingNewPage && loader}
        {!hasMore && !isLoadingNewPage && end}
      </div>
    </div>
  );
}

export function ComposeNew({ messageId }: { messageId?: number }) {
  const {
    mutate: send,
    isPending,
    isSuccess,
  } = api.canvas.inbox.reply.useMutation();
  const [content, setContent] = useState("");
  const convert = new Converter();
  return (
    <div className="flex flex-col gap-4">
      <TextEditor
        saveId={`inbox-draft-${messageId}`}
        content={content}
        setContent={setContent}
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => {
            send({
              conversationId: messageId!,
              body: convert
                .makeMarkdown(content)
                .replaceAll("\n\n", "\n")
                .replaceAll("<sup>", "^")
                .replaceAll("</sup>", "")
                .replaceAll("<sub>", "_")
                .replaceAll("</sub>", "")
                .replaceAll(
                  '<span data-name="crossed_fingers" data-type="emoji">',
                  "",
                )
                .replaceAll("</span>", ""),
            });
          }}
          disabled={isPending}
        >
          {(() => {
            if (isPending) {
              return (
                <>
                  Sending <Loader className="animate-spin" />
                </>
              );
            } else if (isSuccess) {
              return (
                <>
                  Sent <Check />
                </>
              );
            } else {
              return (
                <>
                  Send <Send />
                </>
              );
            }
          })()}
        </Button>
      </div>
    </div>
  );
}
