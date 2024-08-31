import { env } from "@/env";
import { Assignment, ModuleItem } from "@/server/api/routers/canvas";
import { type ClassValue, clsx } from "clsx";
import {
  Check,
  CheckCheck,
  CircleSlash,
  FileText,
  HelpCircle,
  Link2,
  MessageCircle,
  Newspaper,
  NotepadText,
  Presentation,
  SquareArrowOutUpRight,
  SquareCheck,
  Table,
  Upload,
} from "lucide-react";
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

export function moduleType(item: ModuleItem | Assignment) {
  switch (("type" in item ? item.type : "Assignment").toLowerCase()) {
    case "externalurl":
      if ("external_url" in item) {
        if (item.external_url.startsWith("https://docs.google.com/document")) {
          return (
            <>
              <FileText /> Google Docs
            </>
          );
        } else if (
          item.external_url.startsWith("https://docs.google.com/presentation")
        ) {
          return (
            <>
              <Presentation /> Google Slides
            </>
          );
        } else if (
          item.external_url.startsWith("https://docs.google.com/spreadsheets")
        ) {
          return (
            <>
              <Table /> Google Sheets
            </>
          );
        }
      }
      return (
        <>
          <Link2 /> External URL
        </>
      );
    case "page":
      return (
        <>
          <FileText /> Page
        </>
      );
    case "quiz":
      return (
        <>
          <SquareCheck /> Quiz
        </>
      );
    case "assignment":
      return (
        <>
          <NotepadText /> Assignment
        </>
      );
    case "discussion":
      return (
        <>
          <MessageCircle /> Discussion
        </>
      );
    default:
      return "type" in item ? (
        <>
          <HelpCircle /> {item.type}
        </>
      ) : (
        <>
          <HelpCircle /> Unknown
        </>
      );
  }
}

export function submissionType(submission: string) {
  switch (submission.toLowerCase()) {
    case "online_text_entry":
      return <>Text Entry</>;
    case "online_upload":
      return <>File Upload</>;
    case "external_tool":
      return <>External Tool</>;
    case "on_paper":
      return <>On Paper</>;
    case "quiz":
    case "online_quiz":
      return <>Quiz</>;
    case "online_url":
      return <>URL</>;
    case "none":
      return <>Nothing</>;
    default:
      return <>{submission}</>;
  }
}

export function submissionTypeWithIcon(submission: string) {
  switch (submission.toLowerCase()) {
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
    case "on_paper":
      return (
        <>
          <Newspaper /> On Paper
        </>
      );
    case "external_tool":
      return (
        <>
          <SquareArrowOutUpRight /> External Tool
        </>
      );
    case "quiz":
    case "online_quiz":
      return (
        <>
          <SquareCheck /> Quiz
        </>
      );
    case "online_url":
      return (
        <>
          <Link2 /> URL
        </>
      );
    case "none":
      return (
        <>
          <CircleSlash /> Nothing
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

export function prettyState(state: string) {
  switch (state.toLowerCase()) {
    case "graded":
      return (
        <>
          <CheckCheck /> Graded
        </>
      );
    case "submitted":
      return (
        <>
          <Check /> Submitted
        </>
      );
    case "unsubmitted":
      return (
        <>
          <CircleSlash /> Not Submitted
        </>
      );
    default:
      return (
        <>
          <HelpCircle /> {state}
        </>
      );
  }
}
