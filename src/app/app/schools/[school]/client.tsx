"use client";

import { format } from "date-fns";
import { useRef } from "react";

export function LocalTime({ time }: { time: string | undefined }) {
  const now = useRef(new Date());

  return (
    <span>
      {format(
        new Date(format(now.current, "yyyy-MM-dd'T'") + time + "Z"),
        "hh:mm a",
      )}
    </span>
  );
}
