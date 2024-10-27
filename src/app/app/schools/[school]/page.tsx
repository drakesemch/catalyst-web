import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import { CircleUserRound, MapPin, Pencil, School } from "lucide-react";

export default async function SchoolPage(props: { params: Promise<{ school: string }> }) {
  const params = await props.params;

  const {
    school: schoolId
  } = params;

  const school = await api.catalyst.school.get.draft.details({
    id: schoolId,
  });

  const schedules = await api.catalyst.school.get.saved.schedules({
    id: schoolId,
  });

  const now = new Date();

  return (<main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
    <div className="flex w-[min(100ch,100%)] flex-col gap-6">
      <div className="flex items-center gap-4 h1">
        <School />
        <div className="flex flex-col">
          <h1>{school?.name ?? "School Not Found"}</h1>
          <h2 className="text-lg font-medium text-muted-foreground">{school?.district ?? "No District"}</h2>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="text-xs text-muted-foreground rounded-full px-4 py-1 h-8" href={`https://www.google.com/maps/place/${school?.address} ${school?.city} ${school?.state}`} target="_blank"><MapPin /> {school?.address}, {school?.city}, {school?.state}</Button>
        <Button variant="outline" className="text-xs text-muted-foreground rounded-full px-4 py-1 h-8" href={school?.canvasURL ?? ""} target="_blank"><CircleUserRound /> {school?.canvasURL}</Button>
        <Button variant="outline" className="text-xs text-muted-foreground rounded-full px-4 py-1 h-8 pointer-events-none"><School /> {school?.name?.split(" ").slice(-2).join(" ")}</Button>
        <Button variant="secondary" className="text-xs text-muted-foreground rounded-full px-4 py-1 h-8"><Pencil /> Modify Schedule</Button>
      </div>
      <h3 className="h2">Schedules</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {schedules.map((schedule) => (
          <div key={schedule?.schedule?.id} className="flex flex-col gap-4">
            <h4 className="h3">{schedule?.schedule?.name}</h4>
            <div className="flex flex-col gap-4">
              {schedule.periods.map((period) => (
                <div
                  key={period?.period?.id ?? -1}
                  className="flex w-full flex-col rounded border"
                >
                  <div className="flex items-stretch">
                    <div
                      className="h-auto flex-1 overflow-hidden px-4 py-2"
                    >
                      <div className="flex flex-1 flex-col items-start justify-center gap-1 overflow-hidden">
                        <span className="font-bold">
                          {period?.period?.periodName}
                        </span>
                        <span className="max-w-full truncate text-xs text-muted-foreground">
                          {period?.period?.optionName}
                        </span>
                      </div>
                    </div>
                  </div>
                  {period?.period_time && (
                    <div
                      className="flex flex-col border-t"
                    >
                      <div className="flex items-center justfiy-between gap-4 px-4 py-2 text-xs">
                        <span>
                          {format(
                            new Date(
                              format(now, "yyyy-MM-dd ") +
                              period?.period_time?.start +
                              " UTC",
                            ),
                            "hh:mm a",
                          )}
                        </span>
                        <span>
                          {format(
                            new Date(
                              format(now, "yyyy-MM-dd ") +
                              period?.period_time?.end +
                              " UTC",
                            ),
                            "hh:mm a",
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>);
}