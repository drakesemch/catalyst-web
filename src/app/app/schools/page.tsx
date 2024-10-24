import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function SchoolPage() {
    const school = await api.catalyst.school.get.draft.details();

    redirect(`/app/schools/${school?.id ?? "error"}`);
}