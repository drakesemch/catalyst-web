"use client";

import { AlertCircle, Battery, Bluetooth, Clock, Wifi } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

export function MobilePreview() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        `${now.getHours() % 12}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-10 right-1/2 -z-30 translate-x-1/2 md:right-10 md:translate-x-0">
      <div className="animate-float relative h-96 w-60 rounded-2xl border-4 border-secondary bg-background md:rotate-6">
        <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full border bg-black"></div>
        <div className="absolute top-2 flex w-full items-center justify-between px-4 text-xs">
          <div className="w-16 text-center font-bold">{time}</div>
          <div className="flex items-center gap-2">
            <Wifi />
            <Bluetooth />
            <Battery />
          </div>
        </div>
        <div className="absolute top-8 flex w-full flex-col items-stretch gap-2 p-2">
          <span className="text-md font-bold">Notifications</span>
          <div className="flex gap-2 overflow-hidden rounded-lg border px-2 py-1">
            <div className="grid size-10 place-items-center text-lg text-destructive">
              <AlertCircle strokeWidth={3} />
            </div>
            <div className="overflow-hidden">
              <p className="text-md w-full truncate font-bold">Mouse Lab</p>
              <p className="text-xs text-destructive">MISSING!</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-hidden rounded-lg border px-2 py-1">
            <div className="grid size-10 place-items-center text-lg text-muted-foreground">
              <Clock strokeWidth={3} />
            </div>
            <div className="overflow-hidden">
              <p className="text-md w-full truncate font-bold">Math Test</p>
              <p className="text-xs text-muted-foreground">Next Week</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-hidden rounded-lg border px-2 py-1">
            <Score />
            <div className="overflow-hidden">
              <p className="text-md w-full truncate font-bold">
                Reading Chapters 2-3
              </p>
              <p className="text-xs text-muted-foreground">Graded 3 hours</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-hidden rounded-lg border px-2 py-1">
            <Score />
            <div className="overflow-hidden">
              <p className="text-md w-full truncate font-bold">WS: p10-12</p>
              <p className="text-xs text-muted-foreground">Graded 3 hours</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-8 -left-8 z-10 h-[36rem] w-72 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}

function pickColor(score: number) {
  if (score >= 100) return "hsl(217.2 91.2% 59.8%)";
  if (score >= 90) return "hsl(160.1 84.1% 39.4%)";
  if (score >= 80) return "hsl(37.7 92.1% 50.2%)";
  if (score == 0) return "hsl(0 84.2% 60.2%)";
}

export function Score({ pct }: { pct?: number }) {
  const score = useRef(pct ?? Math.round(Math.random() * 16) + 85);
  const chartData = useRef([
    { metric: "score", pct: score.current, fill: "var(--color-score)" },
  ]);
  const chartConfig = useRef({
    pct: {
      label: "pct",
    },
    score: {
      label: "Score",
      color: pickColor(score.current),
    },
  } satisfies ChartConfig);

  return (
    <ChartContainer config={chartConfig.current} className="aspect-square h-10">
      <RadialBarChart
        data={chartData.current}
        startAngle={90}
        endAngle={-(score.current * 3.6 - 90)}
        innerRadius={15}
        outerRadius={15 + 10}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[15 + 5, 15 - 5]}
        />
        <RadialBar
          dataKey="pct"
          background
          cornerRadius={10}
          className="[&_path]:transition-colors"
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-[0.65rem] font-bold"
                    >
                      {score.current}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
