import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await api.catalyst.auth.state()) redirect("/app");
  return children;
}
