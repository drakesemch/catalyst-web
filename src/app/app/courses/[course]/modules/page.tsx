"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Modules({
  params: { course },
}: {
  params: { course: string };
}) {
  const [modules] = api.canvas.courses.get.modules.get.useSuspenseQuery({
    courseId: Number(course),
  });
  const [search, setSearch] = useState("");
  return (
    <main className="mx-auto flex max-w-[100ch] flex-col gap-2 p-4">
      <h1 className="h1">Modules</h1>
      <div className="flex items-center gap-2 rounded border px-3 py-2 [&:has(input:focus-visible)]:outline">
        <Search />
        <input
          type="search"
          placeholder="Search courses..."
          className="flex-1 bg-background outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <Accordion type="multiple">
          {modules
            .filter(
              (module) =>
                search == "" ||
                module.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((module) => (
              <AccordionItem value={String(module.id)} key={module.id}>
                <AccordionTrigger>{module.name}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {module.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Button
                        href={`/app/courses/${course}/modules/${module.id}/items/${item.id}`}
                        className="flex-1"
                        variant="outline"
                      >
                        {item.title}
                      </Button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </main>
  );
}
