import { cn } from "@/lib/utils";

export function SquigglySeparator({
  className,
  waveColor,
  waveWidth,
  fillColor,
}: {
  className?: string;
  waveColor?: string;
  waveWidth?: number;
  fillColor?: string;
}) {
  const randomId = Math.random().toString(36).substring(7);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 440"
      preserveAspectRatio="xMinYMin meet"
      className={cn("h-8 !w-full", className)}
    >
      <defs>
        <pattern
          suppressHydrationWarning={true}
          id={`wave-${randomId}`}
          patternUnits="userSpaceOnUse"
          width="420"
          height="440"
        >
          <path
            d="
            M 0 162
            C 124.5539924122527  162
            115.4460075877473  278
            220 278 S 315.4460075877473 162
            420 162
          "
            style={{
              fill: fillColor ?? "none",
              stroke: waveColor ?? "currentColor",
            }}
            strokeWidth={waveWidth ?? 50}
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect
        fill={`url(#wave-${randomId})`}
        suppressHydrationWarning={true}
        x="0"
        y="0"
        width="1000000000"
        height="440"
      />
    </svg>
  );
}
