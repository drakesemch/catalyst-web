"use client";

import { api } from "@/trpc/react";
import { TodoCard } from "@/components/catalyst/app/todo";
import { Skeleton } from "@/components/ui/skeleton";

export function Todos() {
  const { data, isPending } = api.canvas.todo.upcoming.useQuery();

  if (isPending) {
    return (
      <>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
      </>
    );
  }

  return (
    <>
      {data
        ?.sort((a, b) =>
          Number(new Date(a?.plannable.todo_date ?? 0)) >
          Number(new Date(b?.plannable.todo_date ?? 0))
            ? -1
            : 1,
        )
        .map((todo) => <TodoCard key={todo.plannable_id} todo={todo} />)}
    </>
  );
}
