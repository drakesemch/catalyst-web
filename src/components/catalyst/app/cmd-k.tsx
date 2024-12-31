"use client";

import {
  Album,
  ArrowLeft,
  ArrowRight,
  Bug,
  ChartNoAxesGantt,
  CircleDollarSign,
  Compass,
  Copy,
  Globe,
  HelpCircle,
  House,
  Info,
  LayoutDashboard,
  Monitor,
  Moon,
  Newspaper,
  Palette,
  Printer,
  RotateCw,
  Settings,
  Sparkles,
  Sun,
  Terminal,
  UserCircle,
} from "lucide-react";

import { CmdK } from "@/components/catalyst/cmd-k";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function AppCmdK({ is404 }: { is404?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();

  return (
    <CmdK
      options={{
        groups: [
          {
            heading: (
              <>
                <Sparkles /> Smart Actions
              </>
            ),
            items: [
              pathname != "/app" || is404
                ? {
                    id: "smart action dashboard",
                    type: "item",
                    label: (
                      <>
                        <LayoutDashboard /> Go to Dashboard
                      </>
                    ),
                    onSelect: () => {
                      router.push("/app");
                    },
                    keyboard: {
                      ctrl: true,
                      key: "Enter",
                    },
                  }
                : null,
              {
                id: "smart action courses",
                type: "list",
                breadcrumb: "Courses",
                label: (
                  <>
                    <Album /> Courses
                  </>
                ),
                // keyboard: {
                //   key: "T",
                // },
                groups: [
                  {
                    heading: (
                      <>
                        <Album /> Courses
                      </>
                    ),
                    items: [
                      {
                        id: "theme-system",
                        type: "item",
                        label: (
                          <>
                            <Monitor /> System
                          </>
                        ),
                        onSelect: () => {
                          setTheme("system");
                        },
                        shouldCleanUp: false,
                      },
                      {
                        id: "theme-light",
                        type: "item",
                        label: (
                          <>
                            <Sun /> Light
                          </>
                        ),
                        onSelect: () => {
                          setTheme("light");
                        },
                        shouldCleanUp: false,
                      },
                      {
                        id: "theme-dark",
                        type: "item",
                        label: (
                          <>
                            <Moon /> Dark
                          </>
                        ),
                        onSelect: () => {
                          setTheme("dark");
                        },
                        shouldCleanUp: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            heading: (
              <>
                <Compass /> Navigation
              </>
            ),
            items: [
              {
                id: "home",
                type: "item",
                label: (
                  <>
                    <House /> Go to Home page
                  </>
                ),
                onSelect: () => {
                  router.push("/home");
                },
              },
              {
                id: "timeline",
                type: "item",
                label: (
                  <>
                    <ChartNoAxesGantt /> Go to Timeline page
                  </>
                ),
                onSelect: () => {
                  router.push("/timeline");
                },
              },
              {
                id: "get started",
                type: "item",
                label: (
                  <>
                    <UserCircle /> Get Started
                  </>
                ),
                onSelect: () => {
                  router.push("/auth");
                },
                keyboard: {
                  key: "Enter",
                  ctrl: true,
                },
              },
              {
                id: "about",
                type: "item",
                label: (
                  <>
                    <Info /> Go to About page
                  </>
                ),
                onSelect: () => {
                  router.push("/about");
                },
              },
              {
                id: "pricing",
                type: "item",
                label: (
                  <>
                    <CircleDollarSign /> Go to Pricing page
                  </>
                ),
                onSelect: () => {
                  router.push("/pricing");
                },
              },
              {
                id: "blog",
                type: "item",
                label: (
                  <>
                    <Newspaper /> Go to Blog page
                  </>
                ),
                onSelect: () => {
                  router.push("/blog");
                },
              },
              {
                id: "help",
                type: "item",
                label: (
                  <>
                    <HelpCircle /> Go to Help page
                  </>
                ),
                onSelect: () => {
                  router.push("/help");
                },
                keyboard: {
                  key: "F1",
                },
              },
            ],
          },
          {
            heading: (
              <>
                <Settings /> Site Settings
              </>
            ),
            items: [
              {
                id: "theme",
                type: "list",
                breadcrumb: "Theme",
                keyWords: [
                  "theme",
                  "color",
                  "dark",
                  "light",
                  "system",
                  "change",
                  "switch",
                ],
                label: (
                  <>
                    <Palette /> Change Theme
                  </>
                ),
                keyboard: {
                  key: "T",
                },
                groups: [
                  {
                    heading: (
                      <>
                        <Palette /> Change Theme
                      </>
                    ),
                    items: [
                      {
                        id: "theme-system",
                        type: "item",
                        label: (
                          <>
                            <Monitor /> System
                          </>
                        ),
                        onSelect: () => {
                          setTheme("system");
                        },
                        shouldCleanUp: false,
                      },
                      {
                        id: "theme-light",
                        type: "item",
                        label: (
                          <>
                            <Sun /> Light
                          </>
                        ),
                        onSelect: () => {
                          setTheme("light");
                        },
                        shouldCleanUp: false,
                      },
                      {
                        id: "theme-dark",
                        type: "item",
                        label: (
                          <>
                            <Moon /> Dark
                          </>
                        ),
                        onSelect: () => {
                          setTheme("dark");
                        },
                        shouldCleanUp: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            heading: (
              <>
                <Globe /> Browser Actions
              </>
            ),
            items: [
              {
                id: "back",
                type: "item",
                label: (
                  <>
                    <ArrowLeft /> Back
                  </>
                ),
                onSelect: () => {
                  history.back();
                },
                keyboard: {
                  key: "ArrowLeft",
                  alt: true,
                },
              },
              {
                id: "forward",
                type: "item",
                label: (
                  <>
                    <ArrowRight /> Forward
                  </>
                ),
                onSelect: () => {
                  history.forward();
                },
                keyboard: {
                  key: "ArrowRight",
                  alt: true,
                },
              },
              {
                id: "refresh",
                type: "item",
                label: (
                  <>
                    <RotateCw /> Refresh
                  </>
                ),
                onSelect: () => {
                  location.reload();
                },
                keyboard: {
                  key: "R",
                  ctrl: true,
                },
              },
              {
                id: "copy url",
                type: "item",
                label: (
                  <>
                    <Copy /> Copy URL
                  </>
                ),
                onSelect: async () => {
                  await navigator.clipboard.writeText(location.href);
                  toast.info("URL copied to clipboard");
                },
                keyboard: {
                  key: "C",
                  alt: true,
                },
              },
              {
                type: "separator",
              },
              {
                id: "print",
                type: "item",
                label: (
                  <>
                    <Printer /> Print
                  </>
                ),
                onSelect: () => {
                  setTimeout(() => window.print(), 1000);
                },
                keyboard: {
                  key: "P",
                  ctrl: true,
                },
              },
              {
                id: "devtools",
                breadcrumb: "Developer Tools",
                type: "list",
                label: (
                  <>
                    <Bug /> Developer Tools
                  </>
                ),
                groups: [
                  {
                    heading: (
                      <>
                        <Bug /> Developer Tools
                      </>
                    ),
                    items: [
                      {
                        id: "browser devtools",
                        type: "item",
                        label: (
                          <>
                            <Terminal /> Browser Dev Tools
                          </>
                        ),
                        onSelect: () => {
                          debugger;
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }}
    />
  );
}
