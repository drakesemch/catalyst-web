import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "next-themes";

import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CmdKProvider } from "@/components/catalyst/cmd-k";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/components/posthog/provider";

export const metadata: Metadata = {
  title: {
    default: "Catalyst",
    template: "%s | Catalyst",
  },
  description: "Catalyst",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning={true}
    >
      <body>
        <CSPostHogProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <CmdKProvider>
                  <div vaul-drawer-wrapper="" className="bg-background">
                    {children}
                    <Toaster richColors />
                  </div>
                </CmdKProvider>
              </TooltipProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
