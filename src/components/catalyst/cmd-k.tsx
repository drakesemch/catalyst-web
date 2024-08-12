"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronUp,
  Command,
  CornerDownLeft,
  LayoutGrid,
  Option,
  Space,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ProviderProps = {
  open: () => void;
};

export const CmdKContext = React.createContext<
  [ProviderProps, React.Dispatch<React.SetStateAction<ProviderProps>>]
>([
  {
    open: () => {
      /**/
    },
  },
  () => {
    /**/
  },
]);

export const CmdKProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<ProviderProps>({
    open: () => {
      /**/
    },
  });

  return (
    <CmdKContext.Provider value={[state, setState]}>
      {children}
    </CmdKContext.Provider>
  );
};

type CmdKOptions = {
  groups: {
    heading: React.ReactNode;
    items: CmdKItem[];
  }[];
};

type CmdKItem =
  | {
      id: string;
      type: "list";
      label: React.ReactNode;
      breadcrumb?: React.ReactNode;
      keyWords?: string[];
      keyboard?: {
        key: string;
        ctrl?: boolean;
        alt?: boolean;
        meta?: boolean;
        shift?: boolean;
      };
      groups: CmdKOptions["groups"];
    }
  | {
      id: string;
      type: "item";
      label: React.ReactNode;
      onSelect?: () => void | (() => Promise<void>);
      shouldCleanUp?: boolean;
      keyWords?: string[];
      keyboard?: {
        key: string;
        ctrl?: boolean;
        alt?: boolean;
        meta?: boolean;
        shift?: boolean;
      };
    }
  | {
      type: "separator";
    }
  | null;

declare global {
  interface Navigator {
    userAgentData: {
      platform: string;
    };
  }
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex h-7 min-w-7 items-center justify-center rounded bg-accent px-1.5 py-0.5 font-mono transition-colors duration-200"
      data-key
    >
      {children}
    </kbd>
  );
}

function findByPath(pages: string[], groups: CmdKOptions["groups"]) {
  let parentGroup = groups;
  for (const page of pages) {
    const group = parentGroup.find((group) =>
      group.items.some((item) => item?.type == "list" && item.id == page),
    );
    const item = group?.items.find(
      (item) => item?.type == "list" && item.id == page,
    );
    parentGroup = item?.type == "list" ? (item?.groups ?? []) : [];
  }
  return parentGroup;
}

export function CmdK({ options: { groups } }: { options: CmdKOptions }) {
  const [open, setOpen] = React.useState(false);
  const [, setState] = React.useContext(CmdKContext);
  const [pages, setPages] = React.useState<string[]>([]);
  const isMac = React.useRef(false);
  const input = React.useRef<HTMLInputElement>(null);
  const commandContainer = React.useRef<HTMLDivElement>(null);
  const [changing, setChanging] = React.useState(false);
  const [currentMenu, setCurrentMenu] =
    React.useState<CmdKOptions["groups"]>(groups);

  React.useEffect(() => {
    setState({ open: () => setOpen(true) });
  }, [setState]);

  React.useEffect(() => {
    setCurrentMenu(findByPath(pages, groups));
    setTimeout(() => {
      if (!input.current) return;
      input.current.value = "";
    });

    let parentGroup = groups;
    for (const page of pages) {
      const group = parentGroup.find((group) =>
        group.items.some((item) => item?.type == "list" && item.id == page),
      );
      const item = group?.items.find(
        (item) => item?.type == "list" && item.id == page,
      );
      parentGroup = item?.type == "list" ? (item?.groups ?? []) : [];
    }
    setCurrentMenu(parentGroup);
  }, [pages, groups]);

  React.useEffect(() => {
    setTimeout(() => {
      if (
        commandContainer.current?.querySelector('[data-selected="true"]') ==
        null
      ) {
        commandContainer.current
          ?.querySelector("[data-selected]")
          ?.setAttribute("data-selected", "true");
      }

      commandContainer.current
        ?.querySelector('[data-selected="true"]')
        ?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
    }, 100);

    setChanging(true);
    setTimeout(() => setChanging(false), 100);
  }, [pages]);

  React.useEffect(() => {
    isMac.current = navigator.userAgentData
      ? navigator.userAgentData.platform == "macOS"
      : navigator.userAgent.includes("Mac");

    const down = (e: KeyboardEvent) => {
      if (
        (e.key == "k" || e.key == "/") &&
        (isMac.current ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      const handleItem = (item: CmdKItem, pages: string[]) => {
        if (
          document.activeElement?.tagName == "INPUT" ||
          document.activeElement?.tagName == "TEXTAREA" ||
          document.activeElement?.getAttribute("contenteditable") == "true"
        )
          return;
        if (
          (item?.type == "item" || item?.type == "list") &&
          item.keyboard &&
          (item.keyboard.key.toLowerCase() == e.key.toLowerCase() ||
            item.keyboard.key.toLowerCase() == e.code.toLowerCase() ||
            `key${item.keyboard.key.toLowerCase()}` == e.code.toLowerCase()) &&
          (item.keyboard.ctrl == undefined
            ? true
            : isMac.current
              ? e.metaKey
              : e.ctrlKey) &&
          (item.keyboard.alt == undefined
            ? true
            : item.keyboard.alt == e.altKey) &&
          (item.keyboard.shift == undefined
            ? true
            : item.keyboard.shift == e.shiftKey) &&
          (item.keyboard.meta == undefined
            ? true
            : isMac.current
              ? e.ctrlKey
              : e.metaKey)
        ) {
          e.preventDefault();
          if (item.type == "list") {
            setPages([...pages, item.id]);
            setOpen(true);
            return;
          }
          item.onSelect?.();
          if (item.shouldCleanUp ?? true) {
            setOpen(false);
          }
        }
      };

      const handleGroups = (groups: CmdKOptions["groups"], pages: string[]) => {
        groups.forEach((group) => {
          group.items.forEach((item) => {
            switch (item?.type) {
              case "separator":
                break;
              case "list":
                handleGroups(item.groups, [...pages, item.id]);
                handleItem(item, pages);
                break;
              case "item":
                handleItem(item, pages);
                break;
            }
          });
        });
      };

      handleGroups(currentMenu, pages);
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, groups, currentMenu, pages]);

  React.useEffect(() => {
    if (!open) {
      setChanging(true);
      setTimeout(() => setChanging(false), 100);
      setPages([]);
      setTimeout(() => {
        if (!input.current) return;
        input.current.value = "";
      });
    }
  }, [open]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      loop
      className={cn(
        "transition-transform duration-100",
        changing ? "scale-95" : "",
      )}
    >
      <div className="flex flex-col gap-2 bg-background">
        <Breadcrumb className="px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={(e) => {
                  e.preventDefault();
                  setPages([]);
                }}
              >
                <BreadcrumbPage>Root</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pages.map((page, i) => (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem key={`bread-${page}`}>
                  <BreadcrumbLink
                    onClick={(e) => {
                      e.preventDefault();
                      setPages((pages) => pages.slice(0, i + 1));
                    }}
                  >
                    {(() => {
                      const group = groups
                        .find((group) =>
                          group.items.some(
                            (item) => item?.type == "list" && item.id == page,
                          ),
                        )
                        ?.items.find(
                          (item) => item?.type == "list" && item.id == page,
                        );
                      return group?.type == "list"
                        ? (group?.breadcrumb ?? page)
                        : page;
                    })()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <CommandInput
        placeholder="Type a command or search..."
        ref={input}
        onKeyDown={(evt) => {
          if (
            (evt.target as HTMLInputElement).value == "" &&
            evt.key == "Backspace"
          ) {
            setPages((pages) => pages.slice(0, -1));
          }
        }}
      />
      <CommandList ref={commandContainer}>
        <CommandEmpty>No results found.</CommandEmpty>
        {currentMenu.map((group, i) => (
          <>
            {i > 0 && <CommandSeparator className="mx-0" />}
            <CommandGroup
              key={`command-group-${String(group.heading)}`}
              heading={group.heading}
            >
              {group.items.map((item, j) => {
                switch (item?.type) {
                  case "separator":
                    return (
                      <CommandSeparator
                        key={`command-separator-${j + Math.floor(Math.random() * 100) / 100}`}
                      />
                    );
                  case "list":
                  case "item":
                    return (
                      <CommandItem
                        key={`command-item-${item.id}-${j + Math.floor(Math.random() * 100) / 100}`}
                        value={item.id}
                        className='min-h-12 [&[data-selected="true"]_[data-key]]:!bg-primary [&[data-selected="true"]_[data-key]]:!text-primary-foreground'
                        onSelect={() => {
                          if (item.type == "list") {
                            setPages((pages) => [...pages, item.id]);
                            return;
                          }
                          item.onSelect?.();
                          if (item.shouldCleanUp ?? true) {
                            setOpen(false);
                          }
                        }}
                      >
                        {item.label}
                        {item.keyboard && (
                          <CommandShortcut className="hidden gap-2 text-xs sm:flex">
                            {item.keyboard.ctrl && (
                              <Key>{isMac.current ? <Command /> : "Ctrl"}</Key>
                            )}
                            {item.keyboard.alt && (
                              <Key>{isMac.current ? <Option /> : "Alt"}</Key>
                            )}
                            {item.keyboard.shift && (
                              <Key>
                                <ArrowBigUp />
                              </Key>
                            )}
                            {item.keyboard.meta && (
                              <Key>
                                {isMac.current ? <ChevronUp /> : <LayoutGrid />}
                              </Key>
                            )}
                            <Key>
                              {(() => {
                                switch (item.keyboard.key) {
                                  case " ":
                                    return <Space />;
                                  case "ArrowLeft":
                                    return <ArrowLeft />;
                                  case "ArrowRight":
                                    return <ArrowRight />;
                                  case "ArrowDown":
                                    return <ArrowDown />;
                                  case "ArrowUp":
                                    return <ArrowUp />;
                                  case "Enter":
                                    return <CornerDownLeft />;
                                  default:
                                    return item.keyboard.key;
                                }
                              })()}
                            </Key>
                          </CommandShortcut>
                        )}
                      </CommandItem>
                    );
                }
              })}
            </CommandGroup>
          </>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export const OpenCmdK = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...props }, ref) => {
  const [{ open }] = React.useContext(CmdKContext);
  return (
    <Button ref={ref} onClick={() => open()} {...props}>
      {children}
    </Button>
  );
});

OpenCmdK.displayName = "OpenCmdK";
