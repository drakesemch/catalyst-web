// import { AppCmdK } from "@/components/catalyst/app/cmd-k";
// import { AppNav } from "@/components/catalyst/app/navs";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <AppNav />
      <AppCmdK /> */}
      {children}
    </>
  );
}
