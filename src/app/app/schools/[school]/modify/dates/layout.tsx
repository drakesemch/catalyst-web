import { api } from "@/trpc/server";

export default async function ModifyPage(props: {
  params: Promise<{ school: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const { school: schoolId } = params;

  await api.catalyst.school.get.scheduleDates.get.prefetch({
    id: schoolId,
  });

  await api.catalyst.school.get.saved.schedules.prefetch({
    id: schoolId,
  });

  return props.children;
}
