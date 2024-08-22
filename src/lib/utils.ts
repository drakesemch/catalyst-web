import { env } from "@/env";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prettyBody(str?: string) {
  str = str?.replace(
    // new RegExp("(?:<link.*?>|<script.*?><\\/script>)", "g"),
    new RegExp("(?:<script.*?><\\/script>)", "g"),
    "",
  );
  str = str?.replace(
    new RegExp("https://.*\\.instructure.com/api/v1", "g"),
    typeof window != "undefined"
      ? window.location.host
      : env.NODE_ENV == "development"
        ? "http://localhost:3000/app"
        : "https://catalyst.blue-flame.tech/app",
  );
  return str ?? "";
}
