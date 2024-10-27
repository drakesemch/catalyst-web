import { AttachmentPreview } from "@/components/catalyst/app/file-preview";
import { UserAvatar } from "@/components/catalyst/user-avatar";
import { Badge } from "@/components/ui/badge";
import { serverToBase64 } from "@/lib/utils";
import { api } from "@/trpc/server";
import { format, formatDistanceStrict } from "date-fns";
import { Converter } from "showdown";
import { ComposeNew } from "../client";

export default async function MessageItem(
  props: {
    params: Promise<{ message: string }>;
  }
) {
  const params = await props.params;

  const {
    message
  } = params;

  const you = await api.canvas.users.self();
  const messageDetails = await api.canvas.inbox.get({
    conversationId: Number(message),
  });

  const now = new Date();

  const converter = new Converter();

  return (
    <div className="max-h-full overflow-auto">
      {messageDetails.messages
        .sort((a, b) =>
          Number(new Date(a.created_at)) > Number(new Date(b.created_at))
            ? 1
            : -1,
        )
        .map((message, idx) => (
          <div className="@container" key={message.id}>
            <div className="hidden flex-col gap-2 @[1rem]:flex">
              <div className="-mt-[1px] flex w-full flex-col items-center justify-between gap-2 border-y p-4 @md:flex-row">
                <h3 className="h4 flex w-full items-center gap-4 @md:w-auto">
                  <UserAvatar
                    name={
                      messageDetails.participants.find(
                        (part) => part.id == message.author_id,
                      )?.full_name ?? "Unknown"
                    }
                    image={
                      messageDetails.participants.find(
                        (part) => part.id == message.author_id,
                      )?.avatar_url
                    }
                    className="size-10"
                  />
                  <div className="flex w-full flex-col overflow-hidden">
                    <div className="truncate">
                      {messageDetails.participants
                        .find((part) => part.id == message.author_id)
                        ?.full_name.split(" ")
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
                    <div className="truncate text-xs text-muted-foreground">
                      Sent in {messageDetails.context_name ?? "Unknown"}
                    </div>
                  </div>
                </h3>
                <span className="flex flex-row items-end gap-4 text-right text-xs text-muted-foreground @md:flex-col @md:gap-1">
                  {(() => {
                    switch (idx) {
                      case 0:
                        return (
                          <Badge variant="secondary" className="w-max">
                            First Message
                          </Badge>
                        );
                      case messageDetails.messages.length - 1:
                        return (
                          <Badge variant="secondary" className="w-max">
                            Latest Message
                          </Badge>
                        );
                      default:
                        return <></>;
                    }
                  })()}
                  <div>
                    {format(
                      new Date(message.created_at),
                      "hh:mm:ss a 'on' EEE, MMM dd",
                    )}
                  </div>
                  <div>
                    {formatDistanceStrict(new Date(message.created_at), now)}
                  </div>
                </span>
              </div>
              {message.body && (
                <div
                  className="render-fancy p-4"
                  dangerouslySetInnerHTML={{
                    __html: converter
                      .makeHtml(
                        message.body.split(
                          "________________________________",
                        )[0]!,
                      )
                      .replaceAll("\r", "")
                      .replaceAll("\n", "<br />"),
                  }}
                />
              )}
              {message.attachments.length > 0 && (
                <>
                  <h3 className="h4 p-4 pb-2">Attachments</h3>
                  <div className="flex gap-2 overflow-auto px-4 pb-4">
                    {message.attachments.map(async (attachment) => (
                      <AttachmentPreview
                        attachment={{
                          name: attachment.filename,
                          data: await serverToBase64(
                            await (await fetch(attachment.url)).blob(),
                          ),
                          type: attachment["content-type"],
                        }}
                        key={attachment.filename}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      <div className="@container">
        <div className="hidden flex-col gap-2 @[1rem]:flex">
          <div className="flex w-full flex-col items-center justify-between gap-2 border-y p-4 @md:flex-row">
            <h3 className="h4 flex w-full items-center gap-4 @md:w-auto">
              <UserAvatar
                name={
                  messageDetails.participants.find((part) => part.id == you.id)
                    ?.full_name ?? "Unknown"
                }
                image={
                  messageDetails.participants.find((part) => part.id == you.id)
                    ?.avatar_url
                }
                className="size-10"
              />
              <div className="flex w-full flex-col overflow-hidden">
                <div className="truncate">
                  {messageDetails.participants
                    .find((part) => part.id == you.id)
                    ?.full_name.split(" ")
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
                <div className="truncate text-xs text-muted-foreground">
                  Sent in {messageDetails.context_name ?? "Unknown"}
                </div>
              </div>
            </h3>
            <span className="flex flex-row items-end gap-4 text-right text-xs text-muted-foreground @md:flex-col @md:gap-1">
              <Badge variant="secondary" className="w-max">
                Compose Message
              </Badge>
              <div>{format(new Date(), "hh:mm:ss a 'on' EEE, MMM dd")}</div>
              <div>{formatDistanceStrict(new Date(), now)}</div>
            </span>
          </div>
          <div className="p-4">
            <ComposeNew messageId={Number(message)} />
          </div>
        </div>
      </div>
    </div>
  );
}
