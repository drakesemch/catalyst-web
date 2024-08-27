"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const TabsContext = React.createContext<
  [
    [
      HTMLDivElement | null,
      React.Dispatch<React.SetStateAction<HTMLDivElement | null>>,
    ],
  ]
>([
  [
    null,
    () => {
      /**/
    },
  ],
]);

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const [selectedElement, setSelectedElement] =
    React.useState<HTMLDivElement | null>(null);

  return (
    <TabsContext.Provider value={[[selectedElement, setSelectedElement]]}>
      <TabsPrimitive.Root
        ref={ref}
        className={cn(
          "relative isolate inline-flex w-full flex-col overflow-hidden rounded-md text-secondary-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [[selectedElement]] = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "-z-10 mx-auto inline-flex h-10 w-max items-center justify-center rounded-md bg-secondary p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <div
        className={"absolute -z-10 rounded bg-background transition-all"}
        style={{
          top: selectedElement?.offsetTop,
          left: selectedElement?.offsetLeft,
          width: selectedElement?.offsetWidth,
          height: selectedElement?.offsetHeight,
        }}
      />
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const [[, setSelectedElement]] = React.useContext(TabsContext);
  const [itemRef, setItemRef] = React.useState<HTMLDivElement | null>(null);

  const observer = React.useMemo(
    () =>
      typeof window == "undefined"
        ? undefined
        : new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (
                mutation.attributeName === "data-state" &&
                (mutation.target as HTMLDivElement).getAttribute(
                  "data-state",
                ) === "active"
              ) {
                setTimeout(() =>
                  setSelectedElement(mutation.target as HTMLDivElement),
                );
              }
            });
          }),
    [setSelectedElement],
  );

  React.useEffect(() => {
    if (!itemRef) return;
    if (itemRef.getAttribute("data-state") === "active") {
      setSelectedElement(itemRef);
    }
    observer?.observe(itemRef, {
      attributes: true,
    });

    document.addEventListener("resize", () => {
      setSelectedElement(itemRef);
    });

    return () => {
      observer?.disconnect();
    };
  }, [observer, itemRef, setSelectedElement]);

  return (
    <TabsPrimitive.Trigger ref={ref} asChild {...props}>
      <div
        ref={(node) =>
          node
            ? setItemRef(node)
            : (() => {
                /**/
              })()
        }
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        {children}
      </div>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "max-h-[300px] scroll-py-8 overflow-y-auto overflow-x-hidden scroll-smooth",
          className,
        )}
      >
        {children}
      </div>
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
