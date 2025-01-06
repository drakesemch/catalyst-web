"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

export function CourseClassification({ id }: { id: number }) {
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
          localStorage.setItem(
            "classifications",
            JSON.stringify(classifications),
          );
          return classifications;
        });
      },
    });

  useEffect(() => {
    if (classifications[id] == undefined) {
      genClassification({ courseId: id });
    }
  }, [classifications, id, genClassification]);

  return <span>{classifications[id] ?? "No classification"}</span>;
}
