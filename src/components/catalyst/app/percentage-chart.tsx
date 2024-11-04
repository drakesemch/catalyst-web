"use client";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

function pickColor(score: number) {
  if (score >= 100) return "hsl(217.2 91.2% 59.8%)";
  if (score >= 90) return "hsl(160.1 84.1% 39.4%)";
  if (score >= 80) return "hsl(83.7 80.5% 44.3%)";
  if (score >= 70) return "hsl(37.7 92.1% 50.2%)";
  if (score >= 0) return "hsl(0 84.2% 60.2%)";
  return "hsl(0 0% 45%)"; // Default color for invalid scores
}

export function PercentageChart({
  pct,
  className,
}: {
  pct?: number;
  className?: string;
}) {
  const [score, setScore] = useState(pct ?? 0);

  useEffect(() => {
    setScore(pct ?? 0);
  }, [pct]);

  const chartData = useMemo(
    () => [{ metric: "score", pct: score, fill: "var(--color-score)" }],
    [score],
  );

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      pct: {
        label: "pct",
      },
      score: {
        label: "Score",
        color: pickColor(score),
      },
    }),
    [score],
  );

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-square h-10", className)}
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-(score * 3.6 - 90)}
        innerRadius={15}
        outerRadius={25}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[18, 12]}
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
                      {score === -1 ? "N/A" : score.toFixed(0)}
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
