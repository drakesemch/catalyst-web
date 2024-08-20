"use client";

import * as React from "react";
import { type DialogProps as CommandDialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTitle } from "./drawer";

const CommandContext = React.createContext<
  [
    [
      HTMLDivElement | null,
      React.Dispatch<React.SetStateAction<HTMLDivElement | null>>,
    ],
    [number | null, React.Dispatch<React.SetStateAction<number | null>>],
  ]
>([
  [
    null,
    () => {
      /**/
    },
  ],
  [
    null,
    () => {
      /**/
    },
  ],
]);

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, children, ...props }, ref) => {
  const [selectedElement, setSelectedElement] =
    React.useState<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState<number | null>(null);

  return (
    <CommandContext.Provider
      value={[
        [selectedElement, setSelectedElement],
        [scrollTop, setScrollTop],
      ]}
    >
      <CommandPrimitive
        ref={ref}
        className={cn(
          "relative isolate flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <div
          className={cn(
            "absolute -z-10 rounded bg-secondary transition-[top_height]",
            selectedElement == null ? "opacity-0" : "opacity-100",
          )}
          style={{
            top: selectedElement?.offsetTop ?? 0,
            translate: `0 -${scrollTop}px`,
            left: selectedElement?.offsetLeft,
            width: selectedElement?.offsetWidth,
            height: selectedElement?.offsetHeight,
          }}
        />
      </CommandPrimitive>
    </CommandContext.Provider>
  );
});
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({
  children,
  loop,
  className,
  drawer,
  ...props
}: CommandDialogProps & {
  loop?: boolean;
  className?: string;
  drawer?: { className: string };
}) => {
  return (
    <Drawer {...props}>
      <DrawerContent
        className={cn("overflow-hidden p-0 shadow-lg", drawer?.className)}
      >
        <DrawerTitle className="sr-only">Command Palette</DrawerTitle>
        <Command
          className={cn(
            "[&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3",
            className,
          )}
          loop={loop}
        >
          {children}
        </Command>
      </DrawerContent>
    </Drawer>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const [[selectedElement, setSelectedElement]] =
    React.useContext(CommandContext);

  return (
    <div
      className="flex items-center border-b bg-background px-3"
      cmdk-input-wrapper=""
    >
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onInput={() => {
          const currEl = selectedElement;
          setTimeout(() => setSelectedElement(currEl));
        }}
        autoFocus
        {...props}
      />
    </div>
  );
});

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [, [, setScrollTop]] = React.useContext(CommandContext);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.addEventListener("scroll", () => {
      setScrollTop(containerRef.current!.scrollTop);
    });
  }, [setScrollTop]);

  return (
    <CommandPrimitive.List ref={ref} {...props}>
      <div
        ref={containerRef}
        className={cn(
          "max-h-[300px] scroll-py-8 overflow-y-auto overflow-x-hidden scroll-smooth",
          className,
        )}
      >
        {children}
      </div>
    </CommandPrimitive.List>
  );
});

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => {
  const [[, setSelectedElement]] = React.useContext(CommandContext);

  return (
    <CommandPrimitive.Empty ref={ref} {...props} asChild>
      <div
        ref={() => setSelectedElement(null)}
        className="py-6 text-center text-sm"
      >
        {props.children}
      </div>
    </CommandPrimitive.Empty>
  );
});

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:gap-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("mx-6 my-2 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const [[, setSelectedElement]] = React.useContext(CommandContext);
  const [itemRef, setItemRef] = React.useState<HTMLDivElement | null>(null);

  const observer = React.useMemo(
    () =>
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName == "data-selected" &&
            (mutation.target as HTMLDivElement).getAttribute("data-selected") ==
              "true"
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
    if (itemRef.getAttribute("data-selected") == "true") {
      setTimeout(() => {
        setSelectedElement(itemRef);
      }, 1);
    }
    observer.observe(itemRef, {
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [observer, itemRef, setSelectedElement]);

  return (
    <CommandPrimitive.Item ref={ref} {...props} asChild>
      <div
        ref={(node) =>
          node
            ? setItemRef(node)
            : (() => {
                /**/
              })()
        }
        className={cn(
          "relative flex cursor-default select-none items-center gap-2 rounded-sm !px-4 !py-2 text-sm outline-none transition-all duration-200 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          className,
        )}
      >
        {children}
      </div>
    </CommandPrimitive.Item>
  );
});

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
