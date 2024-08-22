"use client";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

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
  if (score >= 80) return "hsl(37.7 92.1% 50.2%)";
  if (score == 0) return "hsl(0 84.2% 60.2%)";
}

export function PercentageChart({
  pct,
  className,
}: {
  pct?: number;
  className?: string;
}) {
  const score = useRef(pct ?? 0);
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

  useEffect(() => {
    chartData.current[0]!.pct = score.current;
    chartConfig.current.score.color = pickColor(score.current);
  }, [pct]);

  return (
    <ChartContainer
      config={chartConfig.current}
      className={cn("aspect-square h-10", className)}
    >
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
          polarRadius={[15 + 3, 15 - 3]}
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
                      {score.current == -1 ? "N/A" : score.current}
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
