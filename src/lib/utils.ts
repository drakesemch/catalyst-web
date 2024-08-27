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
  str = replaceCanvasURL(str);
  return str ?? "";
}

export function replaceCanvasURL(str?: string) {
  const baseURL = `${
    typeof window != "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : env.NODE_ENV == "development"
        ? "http://localhost:3000"
        : "https://catalyst.blue-flame.tech"
  }/app/`;
  return str
    ?.replace(new RegExp("https://.*\\.instructure.com/api/v1/", "g"), baseURL)
    ?.replace(new RegExp("https://.*\\.instructure.com/", "g"), baseURL);
}
