"use client";

import { useMemo } from "react";

export function TimeOfDay() {
  const message = useMemo(() => {
    const run = () => {
      const date = new Date();
      const hours = date.getHours();
      if (hours >= 0 && hours < 12) {
        return "morning";
      } else if (hours >= 12 && hours < 18) {
        return "afternoon";
      } else {
        return "evening";
      }
    };
    return run();
  }, []);

  return <>{message}</>;
}
