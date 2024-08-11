// import { AppCmdK } from "@/components/catalyst/app/cmd-k";
// import { AppNav } from "@/components/catalyst/app/navs";

import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await api.catalyst.auth.state())) redirect("/auth");

  return (
    <>
      {/* <AppNav />
      <AppCmdK /> */}
      {children}
    </>
  );
}
