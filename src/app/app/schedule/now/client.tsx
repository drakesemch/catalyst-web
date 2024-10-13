"use client";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { differenceInSeconds, format, isAfter, isBefore, isEqual } from "date-fns";
import { type MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export function TimerClientPage() {
  const [schedule] =
    api.catalyst.user.canvas.schedule.current.useSuspenseQuery();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const setNewDate = setInterval(() => {
      setNow(new Date());
    });
    return () => clearInterval(setNewDate);
  }, []);

  const currentClass = useMemo(() => {
    let currentPeriods = schedule.times.filter((period) => typeof period.schedule_value.value != "boolean" || period.schedule_value.value != false).filter((period) => isAfter(
      now,
      new Date(
        new Date(
          format(now, "yyyy-MM-dd ") +
          period?.period_time?.start +
          " UTC",
        ),
      ),
    ) &&
      isBefore(
        now,
        new Date(
          new Date(
            format(now, "yyyy-MM-dd ") +
            period?.period_time?.end +
            " UTC",
          ),
        ),
      ));
    if (currentPeriods.length == 0) {
      currentPeriods = schedule.times.filter((period) => typeof period.schedule_value.value != "boolean" || period.schedule_value.value != false).filter((period) => isBefore(
        now,
        new Date(
          new Date(
            format(now, "yyyy-MM-dd ") +
            period?.period_time?.start +
            " UTC",
          ),
        ),
      ))
    };
    const currentPeriod = currentPeriods.reduce((a, b) => {
      if (Number(new Date(
        format(now, "yyyy-MM-dd ") +
        a?.period_time?.end +
        " UTC",
      )) < Number(new Date(
        format(now, "yyyy-MM-dd ") +
        b?.period_time?.end +
        " UTC",
      ))) {
        return a;
      } else {
        return b;
      }
    });
    return currentPeriod;
  }, [schedule, now]);

  const dateToCompare = useMemo(() => {
    const startDate = new Date(
      format(now, "yyyy-MM-dd ") +
      currentClass?.period_time?.start +
      " UTC",
    );
    const endDate = new Date(
      format(now, "yyyy-MM-dd ") +
      currentClass?.period_time?.end +
      " UTC",
    );

    if (isBefore(now, startDate)) {
      return startDate;
    } else {
      return endDate;
    }
  }, [currentClass?.period_time, now]);

  const hours = useMemo(() => {
    return Math.floor(differenceInSeconds(dateToCompare, now) / 3600)
  }, [dateToCompare, now]);

  const minutes = useMemo(() => {
    return Math.floor(differenceInSeconds(dateToCompare, now) % 3600 / 60)
  }, [dateToCompare, now]);

  const seconds = useMemo(() => {
    return Math.floor(differenceInSeconds(dateToCompare, now) % 60)
  }, [dateToCompare, now]);

  const hoursTens = useMemo(() => {
    return Math.floor(hours / 10)
  }, [hours]);

  const hoursOnes = useMemo(() => {
    return hours % 10
  }, [hours]);

  const minutesTens = useMemo(() => {
    return Math.floor(minutes / 10)
  }, [minutes]);

  const minutesOnes = useMemo(() => {
    return minutes % 10
  }, [minutes]);

  const secondsTens = useMemo(() => {
    return Math.floor(seconds / 10)
  }, [seconds]);

  const secondsOnes = useMemo(() => {
    return seconds % 10
  }, [seconds]);

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem-1px)] grid place-items-center">
      <div className="flex flex-col">
        <div className="text-2xl">
          <h1>Time until {currentClass?.period?.periodName} {isEqual(dateToCompare, new Date(format(now, "yyyy-MM-dd ") + currentClass?.period_time?.end + " UTC")) ? "ends" : "starts"}</h1>
        </div>
        <div className="flex gap-2 leading-none overflow-hidden text-8xl items-center" suppressHydrationWarning>
          <Digit value={hoursTens} className={[hoursTens].every((v) => v == 0) ? "text-muted" : ""} />
          <Digit value={hoursOnes} className={[hoursTens, hoursOnes,].every((v) => v == 0) ? "text-muted" : ""} />
          <span className="text-3xl text-muted">:</span>
          <Digit value={minutesTens} className={[hoursTens, hoursOnes, minutesTens].every((v) => v == 0) ? "text-muted" : ""} />
          <Digit value={minutesOnes} className={[hoursTens, hoursOnes, minutesTens, minutesOnes].every((v) => v == 0) ? "text-muted" : ""} />
          <span className="text-3xl text-muted">:</span>
          <Digit value={secondsTens} className={[hoursTens, hoursOnes, minutesTens, minutesOnes, secondsTens].every((v) => v == 0) ? "text-muted" : ""} />
          <Digit value={secondsOnes} className={[hoursTens, hoursOnes, minutesTens, minutesOnes, secondsTens, secondsOnes].every((v) => v == 0) ? "text-muted" : ""} />
        </div>
        <div className="flex items-center justify-around text-xs text-muted">
          <span>hours</span>
          <span>minutes</span>
          <span>seconds</span>
        </div>
      </div>
    </div>
  );
}

const fontSize = 96;
const padding = 15;
const height = fontSize + padding;

function Digit({ value, className }: { value: number, className?: string }) {
  const animatedValue = useSpring(value, {
    stiffness: 300,
    damping: 50,
    mass: 0.5,
  });

  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);

  return (
    <div style={{ height }} className={cn("relative w-[1ch] tabular-nums", className)}>
      {[...Array(10).keys()].map((i) => (
        <MovingNumber key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function MovingNumber({ mv, number }: { mv: MotionValue; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
