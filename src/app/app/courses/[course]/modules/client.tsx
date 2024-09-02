"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, formatDistanceToNowStrict } from "date-fns";
import { PercentageChart } from "@/components/catalyst/app/percentage-chart";
import type { Assignment, ModuleItem } from "@/server/api/routers/canvas";
import {
  prettyState,
  submissionTypeWithIcon,
  replaceCanvasURL,
  moduleType,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ModulesPage({
  params: { course },
}: {
  params: { course: string };
}) {
  const [modules] = api.canvas.courses.get.modules.get.useSuspenseQuery({
    courseId: Number(course),
  });
  const [assignments] =
    api.canvas.courses.get.assignments.list.useSuspenseQuery({
      courseId: Number(course),
    });
  const unassignedAssignments = useMemo(() => {
    return assignments?.filter((assignment) =>
      modules?.every(
        (module) =>
          !module.items?.some(
            (item) =>
              ("id" in item.content_details
                ? item.content_details.id
                : item.content_id) == assignment.id,
          ),
      ),
    );
  }, [assignments, modules]);
  const [search] = useState("");

  return (
    <main className="flex max-w-[100ch] flex-1 flex-col gap-2 p-4">
      <div className="flex flex-col">
        <Accordion type="multiple">
          {modules
            .filter(
              (module) =>
                search == "" ||
                module.name.toLowerCase().includes(search.toLowerCase()) ||
                module.items?.some((item) =>
                  item.title.toLowerCase().includes(search.toLowerCase()),
                ),
            )
            .map((module) => (
              <AccordionItem value={String(module.id)} key={module.id}>
                <AccordionTrigger>{module.name}</AccordionTrigger>
                <AccordionContent
                  className="flex flex-col gap-2"
                  defaultValue=""
                >
                  {module.items
                    ?.filter(
                      (item) =>
                        search == "" ||
                        module.name
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        item.title.toLowerCase().includes(search.toLowerCase()),
                    )
                    ?.map((item) => <ModuleButton key={item.id} item={item} />)}
                </AccordionContent>
              </AccordionItem>
            ))}
          {unassignedAssignments.length > 0 && (
            <AccordionItem value="unclassified">
              <AccordionTrigger>Unclassified Assignments</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2" defaultValue="">
                {unassignedAssignments.map((assignment) => (
                  <ModuleButton
                    key={assignment.id}
                    item={{
                      ...assignment,
                      content_details: assignment,
                    }}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </main>
  );
}

function ModuleButton({
  item,
}: {
  item: ModuleItem | (Assignment & { content_details: Assignment });
}) {
  return (
    <Button
      href={replaceCanvasURL(
        String(
          (() => {
            if ("page_url" in item) {
              return `pages/${item.page_url}`;
            } else if ("external_url" in item) {
              return item.external_url;
            } else if ("html_url" in item.content_details) {
              return item.content_details.html_url;
            } else {
              return item.html_url;
            }
          })(),
        ),
      )}
      className="h-auto w-full justify-between"
      variant="outline"
      target={"external_url" in item ? "_blank" : undefined}
      style={{
        marginLeft: `${"indent" in item ? item.indent : 0}rem`,
      }}
    >
      <div className="flex flex-shrink flex-col items-start gap-1 overflow-hidden">
        <span className="flex items-center gap-2 font-bold">
          {"title" in item ? item.title : item.name}
          <Badge variant="secondary">{moduleType(item)}</Badge>
        </span>
        {item.content_details?.due_at && (
          <>
            <p className="text-xs text-muted-foreground">
              Due{" "}
              {formatDistanceToNowStrict(
                new Date(item.content_details.due_at),
                {
                  addSuffix: true,
                },
              )}{" "}
              at{" "}
              {format(item.content_details.due_at, "hh:mm a 'on' EEE, MMM dd")}
            </p>
            {item.content_details.points_possible && (
              <div className="flex items-center gap-4">
                {"submission" in item.content_details &&
                  item.content_details?.submission?.workflow_state && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {prettyState(
                        item.content_details?.submission?.workflow_state,
                      )}
                    </span>
                  )}
                {"submission_types" in item.content_details &&
                  item.content_details?.submission_types && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {item.content_details?.submission_types.map((type) =>
                        submissionTypeWithIcon(type),
                      )}
                    </span>
                  )}
                <span className="text-xs text-muted-foreground">
                  {"submission" in item.content_details &&
                  item.content_details?.submission?.score ? (
                    <>
                      {Number(
                        item.content_details?.submission?.score.toFixed(2),
                      )}
                      /{item.content_details.points_possible} points
                    </>
                  ) : (
                    <>{item.content_details.points_possible} points possible</>
                  )}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {item.content_details.points_possible && (
        <PercentageChart
          pct={
            "submission" in item.content_details &&
            item.content_details?.submission?.score
              ? (item.content_details?.submission?.score /
                  item.content_details.points_possible) *
                100
              : -1
          }
        />
      )}
    </Button>
  );
}
