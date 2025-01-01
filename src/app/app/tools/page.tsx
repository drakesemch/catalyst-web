import { Button } from "@/components/ui/button";
import { Calculator, Percent, Table } from "lucide-react";

export default async function ToolsPage() {
  return (
    <main className="mx-auto flex max-w-[100ch] flex-1 flex-shrink flex-col gap-2 overflow-auto p-4">
      <h1 className="h1">Tools</h1>
      <div className="flex flex-col gap-2 overflow-auto p-4">
        <Button
          variant="outline"
          className="flex h-auto w-full flex-1 items-center gap-3"
          href="/app/tools/calc"
        >
          <Calculator />
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="font-bold">Calculator</span>
            <span className="text-xs text-muted-foreground">
              Perform calculations with ease
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex h-auto w-full flex-1 items-center gap-3"
          href="/app/tools/ptable"
        >
          <Table />
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="font-bold">Periodic Table</span>
            <span className="text-xs text-muted-foreground">
              Explore the elements.
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="flex h-auto w-full flex-1 items-center gap-3"
          href="/app/courses"
        >
          <Percent />
          <div className="flex flex-1 flex-col items-start gap-1">
            <span className="font-bold">Grade Calculator</span>
            <span className="text-xs text-muted-foreground">
              Enter what-if grades and what-if percentages
            </span>
          </div>
        </Button>
        {/* <Button
              variant="outline"
              className="flex h-auto w-full flex-1 items-center gap-3"
            >
              <Gamepad2 />
              <div className="flex flex-1 flex-col items-start gap-1">
                <span className="font-bold">Games</span>
                <span className="text-xs text-muted-foreground">
                  Take a break to refocus
                </span>
              </div>
              <Badge variant="secondary">Pre Release</Badge>
            </Button><Button
              variant="outline"
              className="flex h-auto w-full flex-1 items-center gap-3"
            >
              <Text />
              <div className="flex flex-1 flex-col items-start gap-1">
                <span className="font-bold">Assignment Summarizer</span>
                <span className="text-xs text-muted-foreground">
                  Understand your assignment better
                </span>
              </div>
              <Badge>Pro</Badge>
            </Button><Button
              variant="outline"
              className="flex h-auto w-full flex-1 items-center gap-3"
            >
              <File />
              <div className="flex flex-1 flex-col items-start gap-1">
                <span className="font-bold">Paper Proof-reader</span>
                <span className="text-xs text-muted-foreground">
                  Improve your writing
                </span>
              </div>
              <Badge>Pro</Badge>
            </Button> */}
      </div>
    </main>
  );
}
