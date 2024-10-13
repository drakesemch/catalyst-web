"use client";

import { Button } from "@/components/ui/button";
import { CircleSlash, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import prettyBytes from "pretty-bytes";
import { createPortal } from "react-dom";

interface UseMediaQueryOptions {
  mediaQuery: string;
  initialState?: boolean;
}

export const useMediaQuery = ({
  mediaQuery,
  initialState = false,
}: UseMediaQueryOptions): boolean => {
  const [matches, setMatches] = useState(initialState);

  useEffect(() => {
    const media = window.matchMedia(mediaQuery);

    const handleChange = () => setMatches(media.matches);

    media.addEventListener("change", handleChange);

    // Set initial state
    setMatches(media.matches);

    return () => media.removeEventListener("change", handleChange);
  }, [mediaQuery]);

  return matches;
};

export function useFileUpload({
  multiple,
  fileTypes,
  includeDropzone = true,
}: {
  multiple?: boolean;
  fileTypes?: string[];
  includeDropzone?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);

  function Component() {
    return (
      <div className="flex flex-col gap-4">
        {includeDropzone && (
          <Dropzone
            onUpload={(file) =>
              setFiles((files) => [...files, ...Array.from(file ?? [])])
            }
          />
        )}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold">Selected Files</h2>
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 rounded-md border px-4 py-2"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {prettyBytes(file.size)}
                  </p>
                </div>
                <div className="ml-auto" />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setFiles(files.filter((itm) => itm !== file))}
                >
                  <CircleSlash />
                </Button>
              </div>
            ))}
          </div>
        )}
        <label className="grid cursor-pointer place-items-center rounded-md border border-dashed p-16">
          <input
            type="file"
            className="hidden"
            multiple={multiple}
            accept={fileTypes?.map((itm) => `.${itm}`)?.join(",")}
            onChange={(evt) =>
              setFiles((files) => [
                ...files,
                ...Array.from(evt.target.files ?? []),
              ])
            }
          />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 font-bold">
              <Upload /> Upload Files Here
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              Maximum of 512 MB files
            </div>
          </div>
        </label>
      </div>
    );
  }

  return [files, Component] as const;
}

export function Dropzone({ onUpload }: { onUpload: (file: FileList) => void }) {
  const popover = useRef<HTMLDialogElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const onDragOver = (evt: DragEvent) => {
      evt.preventDefault();
      popover.current?.showModal();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        popover.current?.close();
      }, 100);
    };
    const onDrop = (evt: DragEvent) => {
      evt.preventDefault();
      onUpload(evt.dataTransfer?.files ?? new FileList());
      popover.current?.close();
    };
    const onDragEnd = () => {
      popover.current?.close();
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragend", onDragEnd);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [onUpload]);

  return isClient ? (
    createPortal(
      <dialog
        ref={popover}
        className="fixed left-0 top-0 z-50 m-0 hidden h-screen max-h-screen w-screen max-w-[100vw] place-items-center bg-background/50 backdrop-blur-xl [&[open]]:grid"
      >
        <div className="flex h-[10rem] w-[40ch] flex-col items-center justify-center gap-2 rounded-xl bg-background p-4 outline -outline-offset-8 outline-secondary">
          <Upload />
          Drop to upload
        </div>
      </dialog>,
      document.body,
    )
  ) : (
    <dialog />
  );
}
