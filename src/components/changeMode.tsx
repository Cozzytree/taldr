import { Mode } from "@/lib/utils";
import React, { useState } from "react";

export default function ChangeMode({
   mode,
   name,
   setMode,
   children,
}: {
   name?: string;
   mode: Mode;
   setMode: (m: Mode) => void;
   children: React.ReactNode;
}) {
   const [isFocused, setFocused] = useState(false);

   return (
      <div className="grid grid-rows-[auto_1fr] h-screen">
         <div className="flex justify-center py-1 border border-b-foreground/20 relative">
            {!isFocused ? (
               <h2
                  onClick={() => setFocused(true)}
                  className="absolute left-2 top-1"
               >
                  {name || "untitled"}
               </h2>
            ) : (
               <input
                  placeholder="name"
                  className="absolute left-2 top-1 bg-transparent outline-none max-w-16 text-sm text-foreground/70"
                  defaultValue={name}
                  onBlur={() => setFocused(false)}
               />
            )}

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
