import type { Editor } from "@tiptap/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { GetReferenceClientRect } from "tippy.js";
import { Button } from "../ui/button";
import Image from "next/image";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";

export const EmojiList = forwardRef(
  (
    props: {
      editor: Editor;
      clientRect: GetReferenceClientRect;
      event: KeyboardEvent;
      items: { name: string; emoji: string; fallbackImage?: string }[];
      command: (x: { name: string }) => void;
    },
    ref,
  ) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ name: item.name });
      }
    };

    const upHandler = useRef(() => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    });

    const downHandler = useRef(() => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    });

    const enterHandler = useRef(() => {
      selectItem(selectedIndex);
    });

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => {
      return {
        onKeyDown: (x: { event: KeyboardEvent }) => {
          if (x.event.key === "ArrowUp") {
            upHandler.current();
            return true;
          }

          if (x.event.key === "ArrowDown") {
            downHandler.current();
            return true;
          }

          if (x.event.key === "Enter") {
            enterHandler.current();
            return true;
          }

          return false;
        },
      };
    }, [upHandler, downHandler, enterHandler]);

    return (
      <Command className="w-[30ch] border">
        <CommandList>
          <CommandGroup>
            {props.items.map((item, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => selectItem(idx)}
                className="bg-transparent p-0"
              >
                <Button
                  className="hover:bg-primary-100 hover:text-primary-900 flex w-full items-center justify-start gap-2 border text-left"
                  variant={selectedIndex == idx ? "secondary" : "outline"}
                >
                  {item.fallbackImage ? (
                    <Image
                      src={item.fallbackImage}
                      width={16}
                      height={16}
                      alt={item.name}
                      className="size-[1em]"
                    />
                  ) : (
                    item.emoji
                  )}
                  :{item.name}:
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
);
EmojiList.displayName = "EmojiList";
