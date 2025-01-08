"use client";

import { LandingFooter } from "@/components/catalyst/landing/navs";
import { SquigglySeparator } from "@/components/catalyst/squiggly-separator";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  DollarSign,
  Flag,
  HelpCircle,
  Power,
  Search,
  Users,
} from "lucide-react";

import { pages } from "./pages";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import Fuse, { type FuseResult } from "fuse.js";

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<FuseResult<(typeof pages)[0]>[]>([]);

  const fuse = useRef(
    new Fuse(pages, {
      keys: ["title", "keywords"],
    }),
  );

  useEffect(() => {
    if (search.trim() == "") {
      setResults([]);
      return;
    }

    const res = fuse.current.search(search.trim());
    setResults(res);
  }, [search]);

  return (
    <>
      <main className="relative flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
        <div className="flex w-[min(80ch,100%)] flex-col items-center gap-6">
          <h1 className="h1 flex items-center gap-4">
            <HelpCircle className="text-5xl" /> Help Center
          </h1>
          <div />
          <label className="flex w-full items-center gap-2 rounded-md border pl-6 text-lg outline-1 focus-within:outline">
            <Search />
            <Input
              placeholder="Search questions and forums"
              className="h-auto !border-0 px-6 py-4 text-lg !ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div />
          {search.trim() == "" ? (
            <>
              <h2 className="h3 w-full text-left">Resources</h2>
              <div className="grid w-[min(80ch,100%)] grid-cols-1 gap-4 overflow-auto md:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
                  <h3 className="h4 flex items-center gap-4">
                    <Flag /> Getting Started
                  </h3>
                  <Separator className="-mx-8 w-auto" />
                  <ul className="flex flex-col pl-4">
                    {pages
                      ?.filter(
                        (page) =>
                          page.category == "Getting Started" && page.featured,
                      )
                      .map((page) => (
                        <li key={page.page}>
                          <Button
                            variant="link"
                            href={page.page}
                            className="h-auto text-muted-foreground"
                          >
                            {page.title}
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
                  <h3 className="h4 flex items-center gap-4">
                    <Power /> Troubleshooting
                  </h3>
                  <Separator className="-mx-8 w-auto" />
                  <ul className="flex flex-col pl-4">
                    {pages
                      ?.filter(
                        (page) =>
                          page.category == "Troubleshooting" && page.featured,
                      )
                      .map((page) => (
                        <li key={page.page}>
                          <Button
                            variant="link"
                            href={page.page}
                            className="h-auto text-muted-foreground"
                          >
                            {page.title}
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
                  <h3 className="h4 flex items-center gap-4">
                    <DollarSign /> Billing
                  </h3>
                  <Separator className="-mx-8 w-auto" />
                  <ul className="flex flex-col pl-4">
                    {pages
                      ?.filter(
                        (page) => page.category == "Billing" && page.featured,
                      )
                      .map((page) => (
                        <li key={page.page}>
                          <Button
                            variant="link"
                            href={page.page}
                            className="h-auto text-muted-foreground"
                          >
                            {page.title}
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border px-8 py-4">
                  <h3 className="h4 flex items-center gap-4">
                    <Users /> Community
                  </h3>
                  <Separator className="-mx-8 w-auto" />
                  <ul className="flex flex-col pl-4">
                    {pages
                      ?.filter(
                        (page) => page.category == "Community" && page.featured,
                      )
                      .map((page) => (
                        <li key={page.page}>
                          <Button
                            variant="link"
                            href={page.page}
                            className="h-auto text-muted-foreground"
                          >
                            {page.title}
                          </Button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="h3 w-full text-left">Search Results</h2>
              <div className="grid h-auto w-[min(80ch,100%)] grid-cols-1 gap-4 overflow-auto">
                {results.length > 0 ? (
                  results
                    .filter((_, idx) => idx < 5)
                    .map((result) => (
                      <Button
                        key={result.item.page}
                        variant="outline"
                        href={result.item.page}
                        className="flex h-auto flex-col items-start gap-2 p-4"
                      >
                        <h3 className="h4 max-w-full truncate">
                          {result.item.title}
                        </h3>
                        <h3 className="flex max-w-full items-center gap-1 truncate text-xs text-muted-foreground">
                          {result.item.category}
                          <ChevronRight className="flex-shrink-0" />
                          {result.item.title}
                        </h3>
                      </Button>
                    ))
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="h4">No results found</h3>
                    <p className="text-muted-foreground">
                      Try searching for something else
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 text-center backdrop-blur-md">
          <h2 className="text-2xl font-bold">
            This section is under construction
          </h2>
          <p className="mt-4 text-gray-500">
            We{"'"}re working hard to bring you the best possible experience.
            Please check back soon!
          </p>
        </div> */}
      </main>
      <SquigglySeparator waveColor="hsl(var(--muted))" />
      <LandingFooter />
    </>
  );
}
