"use client";

import { PercentageChart } from "@/components/catalyst/app/percentage-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyState, submissionTypeWithIcon } from "@/lib/utils";
import type {
  Assignment,
  AssignmentGroup,
  Course,
} from "@/server/api/routers/canvas";
import { format } from "date-fns";
import {
  Album,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronRight,
  CircleSlash,
  Dot,
  Minus,
  MoreHorizontal,
  Percent,
  Slash,
  Undo,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CourseClassification } from "../client";

export function GradesClient({
  course,
  courseDetails,
  grades,
  gradeGroups,
  courseSidebar,
}: {
  course: string;
  courseDetails: Course;
  grades: Assignment[];
  gradeGroups: AssignmentGroup[];
  courseSidebar: React.ReactNode;
}) {
  const [scoreOverrides, setScoreOverrides] = useState<
    Record<number, string | undefined>
  >({});
  const [totalOverrides, setTotalOverrides] = useState<
    Record<number, string | undefined>
  >({});

  const [calculatedWhatIfScore, setCalculatedWhatIfScore] = useState<number>(0);

  useEffect(() => {
    const groups: (undefined | number)[] = [];
    let weightsAdded = 0;
    let calculatedScore = 0;
    grades.forEach((grade) => {
      if ((scoreOverrides[grade.id] ?? grade.submission?.score ?? -1) == -1)
        return;
      groups[grade.assignment_group_id] ??= 0;
      groups[grade.assignment_group_id]! += Number(
        scoreOverrides[grade.id] ?? grade.submission?.score ?? 0,
      );
    });
    gradeGroups.forEach((group) => {
      const pointsScored = groups[group.id]!;
      const totalPoints = grades
        .filter((assignment) => assignment.assignment_group_id == group.id)
        .filter(
          (assignment) =>
            (scoreOverrides[assignment.id] ??
              assignment.submission?.score ??
              -1) != -1,
        )
        .reduce(
          (prev, assignment) => prev + (assignment.points_possible ?? 0),
          0,
        );
      groups[group.id] =
        totalPoints == 0 ? undefined : pointsScored / totalPoints;
    });
    gradeGroups.forEach((group) => {
      if (groups[group.id] == undefined) return;
      weightsAdded += group.group_weight;
      calculatedScore += groups[group.id]! * group.group_weight;
    });
    setCalculatedWhatIfScore((calculatedScore * 100) / weightsAdded);
  }, [gradeGroups, grades, scoreOverrides, totalOverrides]);

  return (
    <>
      <aside className="relative flex h-[calc((100vh-4.5rem-1px))] w-auto flex-shrink-0 flex-col gap-2 border-r p-4 lg:sticky lg:top-[calc(4.5rem)] lg:h-[calc((100vh-4.5rem-1px))] lg:w-[35ch]">
        <Button
          className="h-auto w-full gap-4"
          variant="outline"
          href={`/app/courses/${course}`}
        >
          <Album className="text-lg" />
          <div className="flex max-w-full flex-1 flex-shrink flex-col items-start gap-1 overflow-hidden">
            <span className="h3">
              <CourseClassification id={Number(course)} />
            </span>
            <span className="max-w-full truncate text-xs text-muted-foreground">
              {courseDetails?.original_name}
            </span>
          </div>
          <ChevronRight />
        </Button>
        <Tabs defaultValue="assignment" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="course">
              <Album /> Course
            </TabsTrigger>
            <TabsTrigger value="assignment">
              <Percent /> Grades
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="course"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]]:h-full'
          >
            {courseSidebar}
          </TabsContent>
          <TabsContent
            value="assignment"
            className='flex max-h-full flex-col gap-2 [&[data-state="active"]>div]:h-full [&[data-state="active"]]:h-full'
          >
            <h1 className="h3">Grades</h1>

            {/* <p className="flex gap-1 text-xs text-destructive">
              <AlertCircle className="flex-shrink-0" /> Grade Calculator is in
              early beta, calculations are close to accurate, but please double
              check with Canvas to ensure that they are correct!
            </p> */}
            <div className="mt-2 flex flex-col gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <PercentageChart
                  pct={
                    courseDetails?.enrollments?.at(0)?.computed_current_score ??
                    -1
                  }
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">
                    {calculatedWhatIfScore.toFixed(2)}%
                  </span>
                  {/* <span className="text-xs text-foreground">
                    Canvas Reported Score:{" "}
                    {courseDetails?.enrollments?.at(0)
                      ?.computed_current_score ?? "N/A"}
                    %
                  </span> */}
                </div>
              </div>
              <div className="flex flex-col">
                {gradeGroups.map((group) => {
                  const assignments = grades.filter(
                    (assignment) => assignment.assignment_group_id == group.id,
                  );
                  const gradedAssignments = assignments.filter(
                    (assignment) => (assignment.submission?.score ?? -1) != -1,
                  );
                  const isOverridden = assignments.some(
                    (assignment) =>
                      scoreOverrides[assignment?.id] != undefined &&
                      scoreOverrides[assignment?.id] !=
                        assignment.submission?.score,
                  );
                  const score = assignments
                    .filter(
                      (assignment) =>
                        scoreOverrides[assignment?.id] != "" &&
                        (assignment.submission?.score ?? -1) != -1,
                    )
                    .reduce(
                      (prev, assignment) =>
                        prev +
                        Number(
                          scoreOverrides[assignment?.id] ??
                            assignment.submission?.score ??
                            0,
                        ),
                      0,
                    );
                  const outOf = assignments
                    .filter(
                      (assignment) =>
                        scoreOverrides[assignment?.id] != "" &&
                        (assignment.submission?.score ?? -1) != -1,
                    )
                    .reduce(
                      (prev, assignment) =>
                        prev +
                        Number(
                          totalOverrides[assignment?.id] ??
                            assignment.points_possible ??
                            0,
                        ),
                      0,
                    );
                  return (
                    <div key={group.id} className="border-t p-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 font-bold">{group.name}</div>
                        <div className="text-right">
                          {group.group_weight ?? "N/A"}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-muted-foreground">
                          {assignments.length} assignments{" "}
                          {gradedAssignments.length != assignments.length && (
                            <>({gradedAssignments.length} graded)</>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-right">
                          {Math.round(score * 100) / 100}/
                          {Math.round(outOf * 100) / 100} <Dot />{" "}
                          {((score / outOf) * 100).toFixed(2) == "NaN"
                            ? "N/A"
                            : ((score / outOf) * 100).toFixed(2)}
                          % {isOverridden && "*"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
      <main className="flex w-full max-w-[100ch] flex-1 flex-shrink flex-col gap-2 px-8 py-4 lg:w-0">
        <div className="sticky top-[1.5rem] z-10 -mx-4 flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 md:top-[calc((4.5rem+1px)+1.5rem)]">
          <div className="flex-1 px-2">Name</div>
          <div className="w-[10ch] px-2 text-right">score</div>
          <div className="w-[2ch]" />
          <div className="w-[10ch] px-2 text-right">out of</div>
          <div className="w-2" />
          <div className="w-10" />
        </div>
        <div className="sticky top-0 -mt-8 h-8 w-full bg-background md:top-[4.5rem]" />
        <div className="mt-1 flex flex-col">
          {grades.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col items-stretch gap-2 border-b py-2 md:flex-row"
            >
              <Button
                variant="ghost"
                className="flex h-auto flex-1 flex-col items-start gap-1 overflow-hidden"
                href={`/app/courses/${course}/assignments/${assignment.id}`}
              >
                <div className="max-w-full truncate font-bold">
                  {assignment.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {gradeGroups.find(
                    (group) => group.id == assignment.assignment_group_id,
                  )?.name ?? "N/A"}{" "}
                  (
                  {gradeGroups.find(
                    (group) => group.id == assignment.assignment_group_id,
                  )?.group_weight ?? "N/A"}
                  %)
                </div>
                <div>
                  {"submission_types" in assignment &&
                    assignment?.submission_types && (
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {prettyState(
                            assignment.submission?.workflow_state ??
                              "unsubmitted",
                          )}
                        </span>
                        <Minus />
                        {assignment?.due_at ? (
                          <span className="flex items-center gap-1">
                            <CalendarIcon />
                            {format(
                              new Date(assignment?.due_at ?? ""),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        ) : (
                          <>No due date set</>
                        )}
                        <Minus />
                        {assignment?.submission_types.map((type) => (
                          <span className="flex items-center gap-1" key={type}>
                            {submissionTypeWithIcon(type)}
                          </span>
                        ))}
                      </span>
                    )}
                </div>
              </Button>
              <div className="flex h-full items-center justify-end gap-2">
                <div className="flex h-auto w-[10ch] items-center justify-end gap-1 p-2 text-right">
                  {(scoreOverrides[assignment?.id] ?? "NO") == "" ||
                  (scoreOverrides[assignment?.id] ??
                    assignment.submission?.score ??
                    -1) != (assignment.submission?.score ?? -1) ? (
                    <>
                      <span>
                        {scoreOverrides[assignment?.id] == ""
                          ? "N/A"
                          : scoreOverrides[assignment?.id]}
                      </span>
                      <span
                        className="text-muted-foreground line-through transition-colors"
                        key={`score-${assignment.id}`}
                      >
                        {assignment.submission?.score ?? "N/A"}
                      </span>
                    </>
                  ) : (
                    <span
                      className="transition-colors"
                      key={`score-${assignment.id}`}
                    >
                      {assignment.submission?.score ?? "N/A"}
                    </span>
                  )}
                </div>
                <div className="grid w-[2ch] place-items-center text-right text-muted-foreground">
                  <Slash />
                </div>
                <div className="h-auto w-[10ch] justify-end p-2 text-right">
                  {(((totalOverrides[assignment?.id] ?? "") != "" &&
                    (totalOverrides[assignment?.id] ??
                      assignment.points_possible ??
                      -1) != assignment.points_possible) ??
                  -1) ? (
                    <>
                      <span>
                        {totalOverrides[assignment?.id] == ""
                          ? "N/A"
                          : totalOverrides[assignment?.id]}
                      </span>
                      <span
                        className="text-muted-foreground line-through transition-colors"
                        key={`score-${assignment.id}`}
                      >
                        {assignment.points_possible ?? "N/A"}
                      </span>
                    </>
                  ) : (
                    <span
                      className="transition-colors"
                      key={`score-${assignment.id}`}
                    >
                      {assignment.points_possible ?? "N/A"}
                    </span>
                  )}
                </div>
                <div className="w-2" />
                <div className="grid w-10 place-items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[40ch]" align="end">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <span className="w-[25ch]">What-If Score</span>
                          <Input
                            className="w-[8ch] flex-1 text-right"
                            value={
                              scoreOverrides[assignment?.id] ??
                              assignment?.submission?.score ??
                              ""
                            }
                            onChange={(val) => {
                              setScoreOverrides((prev) => ({
                                ...prev,
                                [assignment.id]: (
                                  val.target.value ??
                                  prev[assignment.id] ??
                                  0
                                ).replace(new RegExp("[^0-9.]", "g"), ""),
                              }));
                            }}
                            placeholder="N/A"
                            inputmode="numeric"
                          />
                          <span className="mr-2 text-xs text-muted-foreground">
                            pts
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => {
                              setScoreOverrides((prev) => ({
                                ...prev,
                                [assignment.id]: undefined,
                              }));
                            }}
                          >
                            <Undo />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => {
                              setScoreOverrides((prev) => ({
                                ...prev,
                                [assignment.id]: "",
                              }));
                            }}
                          >
                            <CircleSlash />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-[25ch]">What-If Out Of</span>
                          <Input
                            className="w-[8ch] flex-1 text-right"
                            value={
                              totalOverrides[assignment?.id] ??
                              assignment?.points_possible ??
                              -1
                            }
                            onChange={(val) => {
                              setTotalOverrides((prev) => ({
                                ...prev,
                                [assignment.id]: (
                                  val.target.value ??
                                  prev[assignment.id] ??
                                  0
                                ).replace(new RegExp("[^0-9.]", "g"), ""),
                              }));
                            }}
                            placeholder={String(assignment.points_possible)}
                            inputmode="numeric"
                          />
                          <span className="mr-2 text-xs text-muted-foreground">
                            pts
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => {
                              setTotalOverrides((prev) => ({
                                ...prev,
                                [assignment.id]: undefined,
                              }));
                            }}
                          >
                            <Undo />
                          </Button>
                          <div className="w-14" />
                        </div>
                        <span className="font-bold">Score Statistics:</span>
                        <div className="relative my-2 h-4 w-full">
                          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-muted" />
                          <div
                            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted-foreground"
                            style={{
                              left: `${((assignment.score_statistics?.min ?? 0) / (assignment.points_possible ?? 1)) * 100}%`,
                              width: `${(((assignment.score_statistics?.max ?? 0) - (assignment.score_statistics?.min ?? 0)) / (assignment.points_possible ?? 1)) * 100}%`,
                            }}
                          />
                          <div
                            className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted-foreground"
                            style={{
                              left: `${((assignment.score_statistics?.lower_q ?? 0) / (assignment.points_possible ?? 1)) * 100}%`,
                              width: `calc(${(((assignment.score_statistics?.median ?? 0) - (assignment.score_statistics?.lower_q ?? 0)) / (assignment.points_possible ?? 1)) * 100}% - 1px)`,
                            }}
                          />
                          <div
                            className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted-foreground"
                            style={{
                              left: `calc(${((assignment.score_statistics?.median ?? 0) / (assignment.points_possible ?? 1)) * 100}% + 1px)`,
                              width: `calc(${(((assignment.score_statistics?.upper_q ?? 0) - (assignment.score_statistics?.median ?? 0)) / (assignment.points_possible ?? 1)) * 100}% - 1px)`,
                            }}
                          />
                          <div
                            className="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-foreground text-left"
                            style={{
                              left: `${((assignment.submission?.score ?? 0) / (assignment.points_possible ?? 1)) * 100}%`,
                            }}
                          />
                          <span
                            className="absolute left-0 top-full w-[5ch] text-left"
                            style={{
                              left: `min(${((assignment.score_statistics?.min ?? 0) / (assignment.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                            }}
                          >
                            {assignment.score_statistics?.min ?? 0}
                          </span>
                          <span
                            className="absolute bottom-full left-0 w-[5ch] text-left"
                            style={{
                              left: `min(${((assignment.score_statistics?.lower_q ?? 0) / (assignment.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                            }}
                          >
                            {assignment.score_statistics?.lower_q ?? 0}
                          </span>
                          <span
                            className="absolute left-0 top-full w-[5ch] text-center"
                            style={{
                              left: `min(${((assignment.score_statistics?.median ?? 0) / (assignment.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                            }}
                          >
                            {assignment.score_statistics?.median ?? 0}
                          </span>
                          <span
                            className="absolute bottom-full left-0 w-[5ch] text-right"
                            style={{
                              left: `min(${((assignment.score_statistics?.upper_q ?? 0) / (assignment.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                            }}
                          >
                            {assignment.score_statistics?.upper_q ?? 0}
                          </span>
                          <span
                            className="absolute left-0 top-full w-[5ch] text-right"
                            style={{
                              left: `min(${((assignment.score_statistics?.max ?? 0) / (assignment.points_possible ?? 1)) * 100}%, calc(100% - 5ch))`,
                            }}
                          >
                            {assignment.score_statistics?.max ?? 0}
                          </span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
