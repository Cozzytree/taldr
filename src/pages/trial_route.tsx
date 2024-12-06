import { lazy, Suspense, useState } from "react";

const Canvas = lazy(() => import("@/_canvas/canvas"));
import Editor from "@/components/editor";
import { cn, Mode } from "@/lib/utils";
import ChangeMode from "@/components/changeMode";
import { LoaderCircle } from "lucide-react";

export default function TrialRoute() {
   const [mode, setMode] = useState<Mode>("canvas");

   return (
      <Suspense
         fallback={
            <div className="h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
               <LoaderCircle className="animate-spin" />
            </div>
         }
      >
         <ChangeMode isTrial={true} mode={mode} setMode={setMode}>
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
                     isPreview={false}
                     initialShapes={[
                        {
                           id: "46c3e083-5976-4fa8-b5e6-ed0d6232e8d9",
                           props: {
                              angle: 0,
                              connectedTo: [],
                              dash: [0, 0], // Example value for a dashed line pattern
                              fill: "#00000000",
                              fontColor: "#ffffff",
                              fontSize: 20,
                              h: 53,
                              lineWidth: 2,
                              name: "", // Set to empty string if not needed
                              offsetX: 88,
                              offsetY: 81,
                              radius: 8,
                              stroke: "#ffffff",
                              text: "Let's\nBegin\n",
                              textAlign: "center",
                              w: 131,
                              x: 190,
                              xRadius: 0, // Default to 0 if not rounded
                              y: 58,
                              yRadius: 0, // Default to 0 if not rounded
                           },
                           type: "rect",
                        },
                     ]}
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
