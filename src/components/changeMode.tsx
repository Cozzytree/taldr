import { Mode } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function ChangeMode({
  mode,
  name,
  updateName,
  setMode,
  isTrial,
  children,
  updating,
}: {
  mode: Mode;
  name?: string;
  isTrial: boolean;
  updating?: boolean;
  setMode: (m: Mode) => void;
  children: React.ReactNode;
  updateName?: () => (name: string) => void;
}) {
  const [isFocused, setFocused] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when isFocused changes to true
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen items-center">
      <div className="flex justify-center py-1 border border-b-foreground/20 relative">
        {isTrial ? (
          <h2 className="absolute left-2 top-1">Trial</h2>
        ) : (
          <>
            {!isFocused && !updating ? (
              <h2
                onClick={() => {
                  setFocused(true);
                }}
                className="absolute left-2 top-1"
              >
                {name || "untitled"}
              </h2>
            ) : (
              <input
                ref={inputRef}
                placeholder="name"
                className="absolute left-2 top-1 bg-transparent outline-none max-w-16 text-sm"
                defaultValue={name}
                onBlur={() => {
                  setFocused(false);
                }}
                onChange={(e) => {
                  updateName?.()(e.target.value);
                }}
              />
            )}
          </>
        )}

        <button
          onClick={() => setMode("editor")}
          className={`${mode === "editor" ? "bg-foreground text-background" : ""} transition-[background] duration-150 px-2 py-1 border border-foreground text-xs rounded-l-sm`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode("both")}
          className={`${mode === "both" ? "bg-foreground text-background" : ""} hidden md:block transition-[background] duration-150 px-2 py-1 border border-foreground text-xs`}
        >
          Both
        </button>
        <button
          onClick={() => setMode("canvas")}
          className={`${mode === "canvas" ? "bg-foreground text-background" : ""} transition-[background] duration-150 px-2 py-1 border border-foreground text-xs rounded-r-sm`}
        >
          Canvas
        </button>
      </div>

      {children}
    </div>
  );
}
