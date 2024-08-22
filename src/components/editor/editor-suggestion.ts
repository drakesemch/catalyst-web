import { type Editor, ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import type { GetReferenceClientRect, Instance, Props } from "tippy.js";
import { EmojiList } from "./emoji-list";

type Emoji = {
  tags: string[];
  shortcodes: string[];
};

const suggestions = {
  items: ({ editor, query }: { editor: Editor; query: string }): Emoji[] => {
    return (editor.storage.emoji as { emojis: Emoji[] }).emojis
      .filter(({ shortcodes, tags }) => {
        return (
          shortcodes.some((shortcode) =>
            shortcode.startsWith(query.toLowerCase()),
          ) || tags.some((tag) => tag.startsWith(query.toLowerCase()))
        );
      })
      .slice(0, 20);
  },

  allowSpaces: false,

  render: () => {
    let component: ReactRenderer | undefined;
    let popup: Instance<Props>[] | undefined;

    return {
      onStart: (props: {
        editor: Editor;
        clientRect: GetReferenceClientRect;
      }) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: { editor: Editor; clientRect: GetReferenceClientRect }) {
        component?.updateProps(props);

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: {
        editor: Editor;
        clientRect: GetReferenceClientRect;
        event: KeyboardEvent;
      }) {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();
          component?.destroy();

          return true;
        }

        return (
          component?.ref as {
            onKeyDown: ({}: {
              editor: Editor;
              clientRect: GetReferenceClientRect;
              event: KeyboardEvent;
            }) => {
              /**/
            };
          }
        )?.onKeyDown(props);
      },

      onExit() {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
};

export default suggestions;
