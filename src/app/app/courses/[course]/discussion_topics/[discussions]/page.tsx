"use client";

import { UserAvatar } from "@/components/catalyst/user-avatar";
import { TextEditor } from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyBody } from "@/lib/utils";
import type { DiscussionEntry } from "@/server/api/routers/canvas";
import { api } from "@/trpc/react";
import { format, formatDistance } from "date-fns";
import {
  Album,
  ArrowLeft,
  Check,
  Edit,
  Loader,
  Megaphone,
  Pencil,
  Search,
  Send,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense, useState, use } from "react";

export default function DiscussionPage(
  props: {
    params: Promise<{
      course: string;
      discussions: string;
    }>;
  }
) {
  const params = use(props.params);

  const {
    course,
    discussions
  } = params;

  const [self] = api.canvas.users.self.useSuspenseQuery();
  const [discussion] = api.canvas.courses.get.discussions.get.useSuspenseQuery({
    courseId: Number(course),
    discussionId: Number(discussions),
    limit: 100,
  });

  const {
    mutate: send,
    isPending: sendIsPending,
    isSuccess: sendIsSuccess,
  } = api.canvas.courses.get.discussions.post.useMutation();

  const {
    mutate: edit,
    isPending: editIsPending,
    isSuccess: editIsSuccess,
  } = api.canvas.courses.get.discussions.edit.useMutation();

  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  const [content, setContent] = useState("");

  if (
    typeof (discussion.entries as DiscussionEntry[] & { errors: object })
      .errors != "undefined"
  ) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-full flex-col justify-center gap-2 p-2 lg:flex-row">
      <aside className="relative h-[calc((100vh-4.5rem-1px)-2rem)] w-auto flex-shrink-0 rounded-lg border p-4 lg:sticky lg:top-[calc(4.5rem+0.5rem)] lg:h-[calc((100vh-4.5rem-1px)-1rem)] lg:w-[35ch]">
        <Tabs defaultValue="grades" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="grades">
              <Megaphone /> Discussion
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="course"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]]:h-full'
          >
            {/* <CourseSidebar course={course} /> */}
          </TabsContent>
          <TabsContent
            value="grades"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
          >
            <h1 className="h1">{discussion.title}</h1>
            <div className="mt-auto flex flex-col gap-2"></div>
          </TabsContent>
        </Tabs>
      </aside>
      <main>
        <div
          dangerouslySetInnerHTML={{ __html: prettyBody(discussion.message) }}
          className="render-white-content max-w-[100ch]"
        />
        <div className="mt-8" />
        <div className="flex items-center gap-2">
          <h2 className="h3">Messages</h2>
          <div className="ml-auto" />
          <label className="flex max-w-[30ch] items-center gap-1 rounded-full border px-3 py-2 text-xs [&:has(input:focus-visible)]:outline">
            <Search />
            <input
              placeholder="Search..."
              className="bg-background text-xs outline-none"
              onChange={(evt) => setSearch(evt.target.value)}
            />
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSort(sort == "newest" ? "oldest" : "newest")}
          >
            {sort == "newest" ? (
              <>
                <SortAsc /> Newest First
              </>
            ) : (
              <>
                <SortDesc /> Oldest First
              </>
            )}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {discussion.entries
            .filter(
              (message) =>
                message.message.toLowerCase().includes(search.toLowerCase()) ||
                discussion.participants
                  .find((person) => person.id == message.user_id)
                  ?.display_name.toLowerCase()
                  .includes(search.toLowerCase()),
            )
            .sort((a, b) =>
              sort == "newest"
                ? Number(new Date(a.created_at)) <
                  Number(new Date(b.created_at))
                  ? 1
                  : -1
                : Number(new Date(a.created_at)) >
                    Number(new Date(b.created_at))
                  ? 1
                  : -1,
            )
            .map(
              (message) =>
                message.user_id &&
                message.message && (
                  <div
                    key={message.id}
                    className="flex flex-col gap-2 rounded-lg border"
                  >
                    <div className="flex items-center justify-between gap-2 border-b p-4">
                      <h3 className="h4 flex items-center gap-2">
                        <UserAvatar
                          name={
                            discussion.participants.find(
                              (person) => person.id == message.user_id,
                            )?.display_name ?? "Unknown"
                          }
                          image={
                            discussion.participants.find(
                              (person) => person.id == message.user_id,
                            )?.avatar_image_url
                          }
                        />
                        {discussion.participants.find(
                          (person) => person.id == message.user_id,
                        )?.display_name ?? "Unknown"}
                      </h3>
                      <div className="flex items-center justify-end gap-4">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(message.created_at),
                              "EEE, MMM dd, yyyy 'at' hh:mm a",
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Sent{" "}
                            {formatDistance(
                              new Date(message.created_at),
                              new Date(),
                            )}{" "}
                            ago
                          </span>
                        </div>
                        {self.id == message.user_id && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditing(message.id);
                              setContent(message.message);
                            }}
                          >
                            <Pencil />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: prettyBody(message.message),
                      }}
                      className="render-fancy render-white-content p-4"
                    />
                  </div>
                ),
            )}
          <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-background p-2">
            {editing && (
              <div className="flex items-center justify-start gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(null)}
                >
                  <ArrowLeft /> Cancel
                </Button>
                <div className="flex items-center gap-2">
                  <Edit /> Edit message
                </div>
              </div>
            )}
            <Suspense fallback={<div>loading...</div>}>
              <TextEditor
                content={content}
                setContent={setContent}
                className="max-h-48"
              />
            </Suspense>
            <div className="flex justify-end">
              <Button
                disabled={sendIsPending || editIsPending}
                onClick={() => {
                  if (editing) {
                    edit({
                      courseId: Number(course),
                      discussionId: Number(discussions),
                      body: content,
                      messageId: editing,
                    });
                    setTimeout(() => {
                      setEditing(null);
                    }, 1000);
                  } else {
                    send({
                      courseId: Number(course),
                      discussionId: Number(discussions),
                      body: content,
                    });
                  }
                }}
              >
                {(() => {
                  if (sendIsSuccess || editIsSuccess) {
                    if (editing) {
                      return (
                        <>
                          Saved <Check />
                        </>
                      );
                    }
                    return (
                      <>
                        Sent <Check />
                      </>
                    );
                  } else if (sendIsPending || editIsPending) {
                    if (editing) {
                      return (
                        <>
                          Saving <Loader className="animate-spin" />
                        </>
                      );
                    }
                    return (
                      <>
                        Sending <Loader className="animate-spin" />
                      </>
                    );
                  } else {
                    if (editing) {
                      return (
                        <>
                          Save <Edit />
                        </>
                      );
                    }
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
        </div>
      </main>
    </div>
  );
}
