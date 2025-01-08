import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CmdKProvider } from "@/components/catalyst/cmd-k";
import { Toaster } from "@/components/ui/sonner";
// import { CSPostHogProvider } from "@/components/posthog/provider";
import { VercelToolbar } from "@vercel/toolbar/next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { env } from "@/env";
import { HighlightInit } from "@highlight-run/next/client";

export const metadata: Metadata = {
  title: {
    default: "Catalyst",
    template: "%s | Catalyst",
  },
  description: "A re-imagined canvas for students",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
  twitter: {
    card: "summary",
    images: "https://catalyst.bluefla.me/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "Catalyst",
    url: "https://catalyst.bluefla.me/",
    images: "https://catalyst.bluefla.me/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const shouldInjectToolbar = env.NODE_ENV === "development";

  return (
    <>
      <HighlightInit
        projectId={"3ej74n3e"}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        environment={env.NODE_ENV}
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
        }}
      />
      <html
        lang="en"
        className={`${GeistSans.variable}`}
        suppressHydrationWarning={true}
      >
        <body>
          <Analytics />
          <SpeedInsights />
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <CmdKProvider>
                  {children}
                  <Toaster
                    className="fixed right-2 top-2 z-0 md:right-[calc(max(calc((100%-120ch)/2),4rem))] md:top-[calc(4.5rem+.5rem+1px)] [&>li]:w-[calc(100vw-2rem)] md:[&>li]:w-[25rem]"
                    position="top-right"
                  />
                </CmdKProvider>
              </TooltipProvider>
            </ThemeProvider>
          </TRPCReactProvider>
          {shouldInjectToolbar && <VercelToolbar />}
        </body>
      </html>
    </>
  );
}
