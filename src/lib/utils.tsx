import { env } from "@/env";
import { type ClassValue, clsx } from "clsx";
import { FileText, HelpCircle, Upload } from "lucide-react";
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

export function renameSubmissionType(submission: string) {
  switch (submission) {
    case "online_text_entry":
      return <>Text Entry</>;
    case "online_upload":
      return <>File Upload</>;
    case "external_tool":
      return <>External Tool</>;
    default:
      return <>{submission}</>;
  }
}

export function renameSubmissionTypeWithIcon(submission: string) {
  switch (submission) {
    case "online_text_entry":
      return (
        <>
          <FileText /> Text Entry
        </>
      );
    case "online_upload":
      return (
        <>
          <Upload /> File Upload
        </>
      );
    case "external_tool":
      return (
        <>
          <HelpCircle /> External Tool
        </>
      );
    default:
      return (
        <>
          <HelpCircle />
          {submission}
        </>
      );
  }
}
