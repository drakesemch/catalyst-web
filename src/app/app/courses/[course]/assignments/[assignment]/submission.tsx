"use client";

import {
  AttachmentPreview,
  FilePreview,
} from "@/components/catalyst/app/file-preview";
import { TextEditor } from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFileUpload } from "@/lib/hooks";
import { submissionTypeWithIcon, clientToBase64 } from "@/lib/utils";
import { api } from "@/trpc/react";
import { format, formatDistanceStrict, isBefore } from "date-fns";
import { ArrowRight, Check, FileText, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function NewSubmission({
  course,
  assignment,
}: {
  course: string;
  assignment: string;
}) {
  const [assignmentData] =
    api.canvas.courses.get.assignments.get.useSuspenseQuery({
      courseId: Number(course),
      assignmentId: Number(assignment),
    });

  const {
    mutate: submitTextAssignment,
    isPending: pendingTextAssignment,
    isSuccess: successTextAssignment,
  } = api.canvas.courses.get.assignments.submit.text.useMutation();
  const {
    mutate: submitFilesToAssignment,
    isPending: pendingFileAssignment,
    isSuccess: successFileAssignment,
  } = api.canvas.courses.get.assignments.submit.files.useMutation();
  const isPending = useMemo(
    () => pendingTextAssignment || pendingFileAssignment,
    [pendingTextAssignment, pendingFileAssignment],
  );
  const isSuccess = useMemo(
    () => successTextAssignment || successFileAssignment,
    [successTextAssignment, successFileAssignment],
  );

  const [files, FileUpload] = useFileUpload({
    multiple: true,
  });

  const [content, setContent] = useState("");

  return (
    <div className="p-4">
      <Tabs defaultValue={assignmentData.submission_types?.at(0) ?? ""}>
        <TabsList className="w-full">
          <div className="flex-1 px-2 text-sm font-bold">Submission Types</div>
          {assignmentData.submission_types.map((submission) => (
            <TabsTrigger key={submission} value={submission}>
              {submissionTypeWithIcon(submission)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value="online_text_entry"
          className="max-h-[min(60vh,40rem)]"
        >
          <TextEditor
            saveId={`assignment-${course}-${assignment}`}
            setContent={setContent}
          />
          <div className="sticky bottom-0 flex w-full items-center justify-end border-t bg-background p-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button>
                  Review Submission <ArrowRight />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    <FileText /> Submission Preview
                  </DrawerTitle>
                </DrawerHeader>
                <TextEditor
                  content={content}
                  readOnly
                  className="render-white-content render-fancy m-4 max-h-[min(50vh,40rem)] rounded"
                />
                <div className="sticky bottom-0 flex w-full items-center justify-end border-t bg-background p-4">
                  <Button
                    onClick={() =>
                      submitTextAssignment({
                        courseId: Number(course),
                        assignmentId: Number(assignment),
                        body: content,
                      })
                    }
                    disabled={isPending}
                  >
                    {(() => {
                      if (isPending) {
                        return (
                          <>
                            Submitting... <Loader className="animate-spin" />
                          </>
                        );
                      } else if (isSuccess) {
                        return (
                          <>
                            Submitted <Check />
                          </>
                        );
                      } else {
                        return (
                          <>
                            Submit <ArrowRight />
                          </>
                        );
                      }
                    })()}
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </TabsContent>
        <TabsContent value="online_upload" className="max-h-[min(60vh,40rem)]">
          <FileUpload />
          <div className="sticky bottom-0 flex w-full items-center justify-end bg-background p-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button>
                  Review Submission <ArrowRight />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    <FileText /> Submission Preview
                  </DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-2 overflow-auto p-4">
                  {files.map((file) => (
                    <div key={file.name} className="flex items-center gap-2">
                      <FilePreview file={file} />
                    </div>
                  ))}
                  <Button
                    onClick={async () => {
                      submitFilesToAssignment({
                        courseId: Number(course),
                        assignmentId: Number(assignment),
                        files: await Promise.all(
                          files.map(async (file) => ({
                            name: file.name,
                            data: await clientToBase64(
                              await (
                                await fetch(URL.createObjectURL(file))
                              ).blob(),
                            ),
                          })),
                        ),
                      });
                    }}
                    disabled={isPending}
                  >
                    {(() => {
                      if (isPending) {
                        return (
                          <>
                            Submitting... <Loader className="animate-spin" />
                          </>
                        );
                      } else if (isSuccess) {
                        return (
                          <>
                            Submitted <Check />
                          </>
                        );
                      } else {
                        return (
                          <>
                            Submit <ArrowRight />
                          </>
                        );
                      }
                    })()}
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function Submissions({
  course,
  assignment,
}: {
  course: string;
  assignment: string;
}) {
  const { data: assignmentData } =
    api.canvas.courses.get.assignments.get.useQuery({
      courseId: Number(course),
      assignmentId: Number(assignment),
    });
  const { data, isPending } =
    api.canvas.courses.get.assignments.submissions.list.useQuery({
      courseId: Number(course),
      assignmentId: Number(assignment),
    });

  const [attachments, setAttachments] = useState<File[][]>([]);

  useEffect(() => {
    (async () => {
      if (!data) {
        setAttachments([]);
        return;
      }
      const toSave = await Promise.all(
        data.map(async (submission) => {
          return await Promise.all(
            submission.attachments?.map(async (attachment) => {
              return new File(
                [await (await fetch(attachment.url)).blob()],
                attachment.filename,
                {
                  type: attachment["content-type"],
                },
              );
            }) ?? [],
          );
        }),
      );
      setAttachments(toSave);
    })().catch(console.error);
  }, [data]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <Skeleton key={idx} className="h-36 w-full" />
          ))}
      </div>
    );
  }

  if (!data) {
    return <>Hmmmm</>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((submission, idx) => (
        <div key={submission.attempt} className="flex flex-col gap-2 p-4">
          <div className="flex flex-col gap-1">
            <h3 className="h3">
              {submission.user?.first_name ?? "Probably You"}
            </h3>
            <div className="text-xs text-muted-foreground">
              {format(
                new Date(submission.submitted_at),
                "hh:mm:ss a 'on' EEE, MMM dd",
              )}{" "}
              {assignmentData?.due_at && (
                <>
                  (
                  {formatDistanceStrict(
                    new Date(submission.submitted_at),
                    new Date(assignmentData?.due_at),
                  )}{" "}
                  {isBefore(
                    new Date(submission.submitted_at),
                    new Date(assignmentData.due_at),
                  )
                    ? "before"
                    : "after"}{" "}
                  due date)
                </>
              )}
            </div>
          </div>
          {submission.body && (
            <div
              className="render-white-content render-fancy"
              dangerouslySetInnerHTML={{ __html: submission.body }}
            />
          )}
          {attachments[idx]?.map((file) => (
            <AttachmentPreview key={file.name} attachment={file} />
          ))}
        </div>
      ))}
    </div>
  );
}
