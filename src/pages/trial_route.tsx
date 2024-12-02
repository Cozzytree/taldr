import { lazy, Suspense, useState } from "react";

const Canvas = lazy(() => import("@/_canvas/canvas"));
import Editor from "@/components/editor";
import { cn, Mode } from "@/lib/utils";
import ChangeMode from "@/components/changeMode";

export default function TrialRoute() {
   const [mode, setMode] = useState<Mode>("canvas");

   return (
      <Suspense
         fallback={
            <div className="h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
               Loading...
            </div>
         }
      >
         <ChangeMode mode={mode} setMode={setMode}>
            <div
               className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
            >
               <div
                  className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-screen overflow-y-auto no-scrollbar-guide`}
               >
                  <Editor />
               </div>
               <div className={cn(mode === "editor" && "hidden")}>
                  <Canvas
                     initialShapes={[]}
                     socketRef={undefined}
                     userId={undefined}
                     workspaceId={undefined}
                  />
               </div>
            </div>
         </ChangeMode>
      </Suspense>
   );
}
