"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  cn,
  moduleType,
  prettyState,
  submissionTypeWithIcon,
} from "@/lib/utils";
import type { Assignment, PlannerItem } from "@/server/api/routers/canvas";
import { api } from "@/trpc/react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { format, formatDistanceStrict } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  CircleSlash,
  Dot,
  Edit,
  Loader,
  Minus,
  Save,
  Trash,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function TodoCard({ todo }: { todo: PlannerItem }) {
  const [isCompleted, setIsCompleted] = useState<CheckedState>(
    !!(
      todo.planner_override?.marked_complete ??
      todo.plannable?.content_details?.submission?.workflow_state == "submitted"
    ),
  );
  const [now, setNow] = useState(new Date());
  const { mutate } = api.canvas.todo.setCompleted.useMutation();

  const [classifications, setClassifications] = useState<
    Record<number, string>
  >(
    JSON.parse(localStorage.getItem("classifications") ?? "{}") as Record<
      number,
      string
    >,
  );

  const { mutate: genClassification } =
    api.catalyst.user.canvas.courses.genClassification.useMutation({
      onSuccess: (data) => {
        if (!data) return;
        setClassifications((classifications) => {
          classifications[data[0]] = data[1];
          classifications = Object.fromEntries(
            Object.entries(classifications).filter(
              ([_, clas]) => clas != "Not Available" && clas != undefined,
            ),
          );
          localStorage.setItem(
            "classifications",
            JSON.stringify(classifications),
          );
          return classifications;
        });
      },
    });

  useEffect(() => {
    if (todo.course?.id && !classifications[todo.course?.id]) {
      genClassification({
        courseId: todo.course.id,
      });
    }
  }, [classifications, genClassification, todo.course?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card key={todo.plannable_id}>
      <CardHeader>
        <CardTitle>
          <label className="flex cursor-pointer items-center gap-2 overflow-hidden">
            <Checkbox
              defaultChecked={isCompleted}
              onCheckedChange={(val) => {
                setIsCompleted(val);
                mutate({
                  create: Number.isNaN(Number(todo.planner_override?.id)),
                  id: Number.isNaN(Number(todo.planner_override?.id))
                    ? 0
                    : Number(todo.planner_override?.id),
                  plannableId: Number(todo.plannable_id) ?? 0,
                  type: todo.plannable_type,
                  completed: Boolean(val),
                });
              }}
              className="text-sm"
            />
            <div
              className={cn(
                "relative truncate transition-all delay-300 after:absolute after:-left-1 after:top-1/2 after:h-0.5 after:w-0 after:-translate-y-1/2 after:rounded-full after:bg-foreground after:transition-all after:delay-0 after:content-['']",
                isCompleted &&
                  "opacity-30 delay-0 after:w-[calc(100%+0.5rem)] after:delay-300",
              )}
            >
              {todo.plannable?.content_details?.name ??
                todo.plannable?.title ??
                "No title"}
            </div>
          </label>
        </CardTitle>
        {(todo.plannable?.content_details?.due_at ??
          todo.plannable?.todo_date) && (
          <>
            <CardDescription
              className={cn(
                "transition-all delay-300",
                isCompleted && "opacity-30 delay-0",
              )}
            >
              Due at{" "}
              {format(
                new Date(
                  todo.plannable?.content_details?.due_at ??
                    todo.plannable?.todo_date ??
                    Date.now(),
                ),
                "hh:mm:ss a 'on' EEE, MMM dd",
              )}{" "}
              {formatDistanceStrict(
                new Date(
                  todo.plannable?.content_details?.due_at ??
                    todo.plannable?.todo_date ??
                    "",
                ),
                now,
                {
                  addSuffix: true,
                },
              )}
            </CardDescription>
          </>
        )}
        <CardDescription
          className={cn(
            "transition-all delay-300",
            isCompleted && "opacity-30 delay-0",
          )}
        >
          {classifications[todo.course?.id ?? 0] ?? "No Classification"} (
          {todo.course?.original_name ?? todo.course?.name ?? "No Course"})
        </CardDescription>
        <CardDescription
          className={cn(
            "mt-2 flex flex-col items-start gap-2 transition-all delay-300 sm:flex-row sm:items-center",
            isCompleted && "opacity-30 delay-0",
          )}
        >
          <span className="flex items-center gap-2">
            {prettyState(
              todo.plannable?.content_details?.submission?.workflow_state ?? "",
            )}
          </span>
          <Dot className="hidden sm:block" />
          <span className="flex items-center gap-2">
            {moduleType({
              type: todo.plannable_type,
            } as unknown as Assignment)}{" "}
          </span>
          <Dot className="hidden sm:block" />
          {(todo.plannable?.content_details?.submission_types?.length ?? 0) ==
            0 && (
            <span className="flex items-center gap-2" key="none">
              {submissionTypeWithIcon("none")}
            </span>
          )}
          {todo.plannable?.content_details?.submission_types.map((type) => (
            <span className="flex items-center gap-2" key={type}>
              {submissionTypeWithIcon(type)}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {todo.plannable_type == "planner_note" ? (
          <PlannerEditNote note={todo} />
        ) : (
          <Button
            variant="outline"
            href={`/app${todo?.html_url?.split("/submissions")[0]}?submit=true`}
          >
            Submit <Upload />
          </Button>
        )}
        {todo.plannable_type == "planner_note" ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button>
                Open <ArrowRight />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {todo.plannable?.content_details?.name ??
                    todo.plannable?.title ??
                    "No title"}
                </DrawerTitle>
              </DrawerHeader>
              <p className="p-4 pt-0">
                {todo.plannable?.content_details?.description ??
                  todo.plannable?.details ??
                  "No description"}
              </p>
            </DrawerContent>
          </Drawer>
        ) : (
          <Button href={`/app${todo.html_url}`}>
            Open <ArrowRight />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function PlannerEditNote({ note }: { note: PlannerItem }) {
  const utils = api.useUtils();

  const { mutate: createTodo, isPending: isEdiding } =
    api.canvas.todo.edit.useMutation({
      onSuccess: (newData) => {
        utils.canvas.todo.upcoming.invalidate().catch(console.error);
      },
    });
  const { mutate: deleteTodo, isPending: isDeleting } =
    api.canvas.todo.delete.useMutation({
      onSuccess: () => {
        utils.canvas.todo.upcoming.setData(undefined, (data) => {
          return data?.filter((todo) => todo.plannable_id != note.plannable_id);
        });
      },
    });

  const isPending = useMemo(
    () => isEdiding || isDeleting,
    [isEdiding, isDeleting],
  );

  const [title, setTitle] = useState(
    note.plannable.content_details?.name ?? note.plannable.title ?? "",
  );
  const [description, setDescription] = useState(
    note.plannable.content_details?.description ?? note.plannable.details ?? "",
  );
  const [date, setDate] = useState<Date | undefined>(
    new Date(
      note.plannable.content_details?.due_at ?? note.plannable.todo_date ?? "",
    ),
  );
  const [time, setTime] = useState<string | undefined>(
    String(date?.getHours() ?? 0).padStart(2, "0") +
      String(date?.getMinutes() ?? 0).padStart(2, "0"),
  );
  const [courseId, setCourseId] = useState<number | undefined>(
    Number(note.course?.id ?? 0),
  );

  const [{ pages }] =
    api.catalyst.user.canvas.courses.list.useSuspenseInfiniteQuery(
      {
        limit: 100,
        enrollment_state: "active",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const courses = useMemo(() => pages?.flatMap((page) => page.data), [pages]);

  const [classifications, setClassifications] = useState<
    Record<number, string>
  >(
    JSON.parse(localStorage.getItem("classifications") ?? "{}") as Record<
      number,
      string
    >,
  );

  const { mutate: genClassification } =
    api.catalyst.user.canvas.courses.genClassification.useMutation({
      onSuccess: (data) => {
        if (!data) return;
        setClassifications((classifications) => {
          classifications[data[0]] = data[1];
          classifications = Object.fromEntries(
            Object.entries(classifications).filter(
              ([_, clas]) => clas != "Not Available" && clas != undefined,
            ),
          );
          localStorage.setItem(
            "classifications",
            JSON.stringify(classifications),
          );
          return classifications;
        });
      },
    });

  useEffect(() => {
    courses?.forEach((course) => {
      if (classifications[course.id] == undefined) {
        genClassification({ courseId: course.id });
      }
    });
  }, [classifications, courses, genClassification]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          Edit <Edit />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Todo Item</DrawerTitle>
          <DrawerDescription>Add an item to your todo list</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Title</span>
            <Input
              placeholder="New Todo Item"
              className="w-full sm:w-[31ch]"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Description</span>
            <Input
              placeholder="Description"
              className="w-full sm:w-[31ch]"
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Course</span>
            <Combobox
              className="ml-auto max-w-[20rem] flex-1"
              placeholders={{
                emptyValue: "Select a course",
                search: "Search for a course",
              }}
              onSelect={(courseId) => {
                setCourseId(Number(courseId));
              }}
              value={String(courseId)}
              groups={[
                {
                  id: "",
                  header: "",
                  values: courses
                    .sort((a, b) =>
                      (a.period?.periodOrder ?? Number.MAX_VALUE) >
                      (b.period?.periodOrder ?? Number.MAX_VALUE)
                        ? 1
                        : -1,
                    )
                    .map((course) => ({
                      id: String(course.id),
                      render: (
                        <div className="flex flex-col gap-2 overflow-hidden">
                          <span className="font-bold">
                            {classifications[course.id] ?? "No Classification"}
                          </span>
                          <span className="flex items-center gap-2 truncate text-xs text-muted-foreground">
                            {course.period?.periodName ?? "No Period"}
                            <Minus className="flex-shrink-0" />
                            <span className="flex-1 truncate">
                              {course.original_name}
                            </span>
                          </span>
                        </div>
                      ),
                      selectionRender: (
                        <div className="flex flex-col gap-2 truncate">
                          {classifications[course.id] ?? "No Classification"} (
                          {course.original_name})
                        </div>
                      ),
                    })),
                },
              ]}
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-bold">Due Date</span>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start sm:w-[30ch]"
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
              <InputOTP
                maxLength={4}
                value={time}
                onChange={(val) => setTime(val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <span>:</span>
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <span className="text-right text-xs text-muted-foreground">
            Times are local 24-hour time
          </span>
        </div>
        <DrawerFooter className="flex flex-row items-center justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() =>
              deleteTodo({
                id: Number(note.plannable_id),
              })
            }
            disabled={isPending}
          >
            {isDeleting ? (
              <>
                Deleting <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Delete <Trash />
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">
              Cancel <CircleSlash />
            </Button>
          </DrawerClose>
          <Button
            onClick={() =>
              createTodo({
                id: Number(note.plannable_id),
                title: title,
                description: description,
                due_at: date
                  ? new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      parseInt(time?.slice(0, 2) ?? "0", 10),
                      parseInt(time?.slice(2, 4) ?? "0", 10),
                    ).toISOString()
                  : undefined,
                course_id: courseId,
              })
            }
            disabled={isPending}
          >
            {isEdiding ? (
              <>
                Saving <Loader className="animate-spin" />
              </>
            ) : (
              <>
                Save <Save />
              </>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
