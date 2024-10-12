import { env } from "@/env";
import type { Assignment, ModuleItem } from "@/server/api/routers/canvas";
import { type ClassValue, clsx } from "clsx";
import {
  Camera,
  Check,
  CheckCheck,
  CircleSlash,
  CircleX,
  File as FileIcon,
  FileText,
  HelpCircle,
  Link2,
  MessageCircle,
  Newspaper,
  NotepadText,
  Presentation,
  SquareArrowOutUpRight,
  SquareCheck,
  StickyNote,
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
        : "https://catalyst.bluefla.me"
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
    case "file":
      return (
        <>
          <FileIcon /> File
        </>
      );
    case "planner_note":
      return (
        <>
          <StickyNote /> Note
        </>
      );
    case "wiki_page":
      return (
        <>
          <FileText /> Wiki Page
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
    case "discussion_topic":
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
    case "media_recording":
      return (
        <>
          <Camera /> Media Recording
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
    case "":
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
          <CircleX /> Not Submitted
        </>
      );
    case "":
      return (
        <>
          <CircleX /> Not Submitted (Inferred)
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

export function prettyEnrollmentType(type: string) {
  switch (type) {
    case "StudentEnrollment":
      return "Student";
    case "TeacherEnrollment":
      return "Teacher";
    case "DesignerEnrollment":
      return "Designer";
    case "ObserverEnrollment":
      return "Observer";
    default:
      return type;
  }
}

export async function clientToBase64(file: File | Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function serverToBase64(file: File | Blob) {
  return Buffer.from(await file.arrayBuffer()).toString("base64");
}

export function constructFile(data: string, filename: string, type?: string) {
  console.log(data);
  const arr = data.split(",");
  const mime = type ?? arr[0]!.match(/:(.*?);/)?.[1];
  const bstr = atob(arr[arr.length - 1] ?? "");
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
