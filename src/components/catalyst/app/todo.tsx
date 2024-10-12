"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowRight, Dot, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export function TodoCard({ todo }: { todo: PlannerItem }) {
  const [isCompleted, setIsCompleted] = useState<CheckedState>(
    !!(
      todo.planner_override?.marked_complete ??
      todo.plannable.content_details?.submission?.workflow_state == "submitted"
    ),
  );
  const [now, setNow] = useState(new Date());
  const { mutate } = api.canvas.todo.setCompleted.useMutation();
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
                  create: Number.isNaN(todo.planner_override?.id),
                  id: Number(todo.planner_override?.id ?? todo.plannable.id),
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
              {todo.plannable.content_details?.name ??
                todo.plannable.title ??
                "No title"}
            </div>
          </label>
        </CardTitle>
        {(todo.plannable.content_details?.due_at ??
          todo.plannable.todo_date) && (
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
                  todo.plannable.content_details?.due_at ??
                    todo.plannable.todo_date ??
                    Date.now(),
                ),
                "hh:mm:ss a 'on' EEE, MMM dd",
              )}{" "}
              {formatDistanceStrict(
                new Date(
                  todo.plannable.content_details?.due_at ??
                    todo.plannable.todo_date ??
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
          {todo.course?.classification} ({todo.course?.name})
        </CardDescription>
        <CardDescription
          className={cn(
            "mt-2 flex flex-col items-start gap-2 transition-all delay-300 sm:flex-row sm:items-center",
            isCompleted && "opacity-30 delay-0",
          )}
        >
          <span className="flex items-center gap-2">
            {prettyState(
              todo.plannable.content_details?.submission?.workflow_state ?? "",
            )}
          </span>
          <Dot className="hidden sm:block" />
          <span className="flex items-center gap-2">
            {moduleType({
              type: todo.plannable_type,
            } as unknown as Assignment)}{" "}
          </span>
          <Dot className="hidden sm:block" />
          {(todo.plannable.content_details?.submission_types?.length ?? 0) == 0 && (
            <span className="flex items-center gap-2" key="none">
            {submissionTypeWithIcon("none")}
          </span>
          )}
          {todo.plannable.content_details?.submission_types.map((type) => (
            <span className="flex items-center gap-2" key={type}>
              {submissionTypeWithIcon(type)}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          href={`/app${todo?.html_url?.split("/submissions")[0]}?submit=true`}
        >
          Submit <Upload />
        </Button>
        <Button href={`/app${todo.html_url}`}>
          Open <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
