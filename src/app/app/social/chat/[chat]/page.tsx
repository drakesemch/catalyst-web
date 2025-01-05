"use client";

import type { CatalystMessage } from "@/components/catalyst/app/notifications";
import { RealtimeContext } from "@/components/catalyst/app/realtime-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader, Send } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function Chat() {
  const lastMessage = useRef<[string, Date]>(["", new Date()]);
  const [message, setMessage] = useState("");
  const { data: self } = api.catalyst.user.get.useQuery();
  const { chat: chatId } = useParams<{ chat: string }>();
  const [hasSent, setHasSent] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const {
    data,
    mutate: sendToServer,
    isPending: isSending,
  } = api.catalyst.user.social.messages.send.useMutation({
    onSuccess: () => {
      setHasSent(true);
      setTimeout(() => {
        setHasSent(false);
      }, 1000);
    },
  });
  const {
    data: messagesFromQuery,
    fetchNextPage,
    hasNextPage,
  } = api.catalyst.user.social.messages.list.useInfiniteQuery(
    {
      chatId: chatId,
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const newMessageIds = useRef(new Set());

  const [newMessages, setNewMessages] = useState<CatalystMessage[]>([]);
  const messages = useMemo(() => {
    setTimeout(() => {
      setScrollTop(100000000 + Math.random());
    }, 1000);
    const messageIds = new Set();
    let messages = [
      ...newMessages,
      ...(messagesFromQuery?.pages.flatMap((page) => page.messages) ?? []),
    ].sort(
      (a, b) => new Date(a.sentAt)?.getTime() - new Date(b.sentAt)?.getTime(),
    );
    messages = messages.filter((msg) => {
      if (messageIds.has(msg.id)) return false;
      messageIds.add(msg.id);
      return true;
    });
    return messages;
  }, [newMessages, messagesFromQuery]);

  const { channel } = useContext(RealtimeContext);

  useEffect(() => {
    if (!channel) return;
    (async () => {
      await channel.subscribe("notification", (message) => {
        const data = message.data as CatalystMessage;
        if (data.type === "catalyst.message") {
          if (data.chatId != chatId) return;
          if (
            messages.some((msg) => msg.id == data.id) ||
            newMessageIds.current.has(data.id)
          )
            return;
          newMessageIds.current.add(data.id);
          console.log(data.sentAt);
          setNewMessages((messages) => [
            ...messages,
            {
              id: data.id,
              chatId: chatId,
              message: data.message,
              attachments: data.attachments,
              reactions: data.reactions,
              sentAt: new Date(data.sentAt),
              user: data.user,
            } as CatalystMessage,
          ]);
        }
      });
    })().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  useEffect(() => {
    if (hasSent) return;
    if (newMessages.some((msg) => msg.id == data?.[0])) return;
    setNewMessages((messages) => [
      {
        type: "catalyst.message",
        id: data?.[0] ?? "",
        chatId: chatId,
        message: lastMessage.current[0],
        attachments: [],
        reactions: [],
        sentAt: new Date(),
        user: self,
      } as CatalystMessage,
      ...messages.filter((msg) => msg.id != ""),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSending, hasSent, data]);

  useEffect(() => {
    if (newMessages.length != 0) {
      setNewMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesFromQuery]);

  const send = () => {
    if (message.trim() == "" || hasSent) return;
    sendToServer({
      id: chatId,
      message: message,
    });
    const date = new Date();
    lastMessage.current = [message, date];
    setNewMessages((messages) => [
      {
        type: "catalyst.message",
        id: "",
        chatId: chatId,
        message: message,
        attachments: [],
        reactions: [],
        sentAt: date,
        user: self,
      } as CatalystMessage,
      ...messages,
    ]);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-8rem-1px)]">
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        start={
          <div className="w-full py-16 text-center text-xs text-muted-foreground">
            No more messages
          </div>
        }
        className="h-full justify-end"
        scrollTop={scrollTop}
      >
        <AnimatePresence>
          {(() => {
            let lastUserId = "";
            return messages.map((message, idx) => {
              if (!message?.user) return;
              const isSameUser = lastUserId == message.user?.id;
              lastUserId = message.user?.id;
              const isSending = message.id == "";
              return (
                <motion.div
                  key={idx}
                  className={cn(
                    "flex gap-2 opacity-100 transition-opacity",
                    !isSameUser && "mt-4",
                    isSending && "opacity-50",
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                >
                  <div className="inline-flex w-[25ch] items-center justify-end gap-2 pl-8 font-bold">
                    {message.user?.id == self?.id && !isSameUser && (
                      <div className="flex items-center justify-end gap-1 rounded-full bg-green-50 p-1 pr-2 dark:bg-green-950">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span className="text-[0.5rem] text-green-500">
                          You
                        </span>
                      </div>
                    )}
                    <span className="truncate">
                      {isSameUser ? "" : message.user.name}
                    </span>
                  </div>
                  {message.message}
                  {isSending && (
                    <span className="ml-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader className="animate-spin" /> Sending...
                    </span>
                  )}
                </motion.div>
              );
            });
          })()}
        </AnimatePresence>
      </InfiniteScroll>
      <div className="sticky bottom-0 flex items-center gap-2 p-2">
        <Input
          placeholder="Message..."
          value={message}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") {
              send();
            }
          }}
          onChange={(evt) => setMessage(evt.target.value)}
        />
        <Button
          onClick={send}
          disabled={isSending || hasSent || message.trim() == ""}
        >
          {(() => {
            if (hasSent) {
              return (
                <>
                  Sent <Check />
                </>
              );
            } else if (isSending) {
              return (
                <>
                  Sending... <Loader className="animate-spin" />
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

function InfiniteScroll({
  next = () => {
    /**/
  },
  hasMore = true,
  loader = null,
  start = null,
  children,
  className,
  scrollTop,
}: {
  next: () => void;
  hasMore: boolean;
  loader: React.ReactNode;
  start: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  scrollTop?: number;
}) {
  const scrollingMessages = useRef<HTMLDivElement | null>(null);
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
    if (scrollTop) {
      scrollingMessages.current?.scrollTo(0, scrollTop);
    }
  }, [scrollTop]);

  useEffect(() => {
    if (!isIntersecting) return;
    setIsLoadingNewPage(true);
    next();
  }, [next, isIntersecting]);

  return (
    <div
      className="h-full max-h-full w-full overflow-auto"
      ref={scrollingMessages}
    >
      <div className={cn("relative flex flex-col gap-1", className)}>
        {hasMore && (
          <div
            key="load-more"
            ref={loadMoreDiv}
            className="absolute bottom-0 h-[80rem] w-0"
          />
        )}
        {!hasMore && !isLoadingNewPage && start}
        {isLoadingNewPage && loader}
        {children}
      </div>
    </div>
  );
}
