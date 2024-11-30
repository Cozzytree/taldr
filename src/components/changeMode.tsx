import { Mode } from "@/lib/utils";
import React from "react";

export default function ChangeMode({
  mode,
  setMode,
  children,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="w-full flex justify-center py-1 border border-b-foreground/20">
        <button
          onClick={() => setMode("editor")}
          className={`${mode === "editor" ? "bg-foreground/20" : ""} hover:bg-foreground/10 transition-[background] duration-150 px-2 py-1 border border-foreground/20 text-xs rounded-l-md`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode("both")}
          className={`${mode === "both" ? "bg-foreground/20" : ""} hidden md:block hover:bg-foreground/10 transition-[background] duration-150 px-2 py-1 border border-foreground/20 text-xs`}
        >
          Both
        </button>
        <button
          onClick={() => setMode("canvas")}
          className={`${mode === "canvas" ? "bg-foreground/20" : ""} hover:bg-foreground/10 transition-[background] duration-150 px-2 py-1 border border-foreground/20 text-xs rounded-r-md`}
        >
          Canvas
        </button>
      </div>

      {children}
    </div>
  );
}
