import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  if (await api.catalyst.user.authState()) {
    redirect("/app");
  } else {
    redirect("/home");
  }
}
