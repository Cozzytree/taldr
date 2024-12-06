import { lazy, Suspense } from "react";
const Canvas = lazy(() => import("@/_canvas/canvas"));
const Editor = lazy(() => import("@/components/editor"));
import { CanvasShape } from "@/_canvas/canvasTypes";
import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Mode } from "@/lib/utils";
import ChangeMode from "@/components/changeMode";

interface Workspace {
   shapes: CanvasShape[];
   _id: string;
   description: string;
   name: string;
   userId: string;
   document: string;
}

const useGetShapes = (workspaceId: string) => {
   const [isLoading, setloading] = useState(false);

   const [data, setData] = useState<Workspace | null>(null);

   const fetchShapes = useCallback(async () => {
      setloading(true);
      try {
         const res = await fetch(
            `${import.meta.env.VITE_API_URL}/workspace_data/${workspaceId}`,
            {
               method: "GET",
            },
         );
         const data = await res.json();
         setData(data);
      } catch (err: unknown) {
         if (err instanceof Error) {
            throw new Error(err.message || "unknown error");
         } else {
            throw new Error("unknown error");
         }
      } finally {
         setloading(false);
      }
   }, [workspaceId]);

   useEffect(() => {
      if (workspaceId) fetchShapes();
   }, [workspaceId, fetchShapes]);

   return { isLoading, data };
};

export default function Preview() {
   const { id } = useParams({ strict: false });
   const [mode, setMode] = useState<Mode>("canvas");

   const { isLoading, data } = useGetShapes(id || "");

   if (isLoading) {
      return (
         <div className="h-screen w-full flex justify-center items-center text-sm text-foreground/70">
            <RefreshCcw className="animate-spin" />
         </div>
      );
   }

   return (
      <div className="min-h-screen w-full">
         <Suspense
            fallback={
               <div className="w-full h-screen flex justify-center items-center text-sm text-foreground/70">
                  <RefreshCcw className="animate-spin" />
               </div>
            }
         >
            <ChangeMode isTrial mode={mode} setMode={setMode} name={data?.name}>
               <div
                  className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
               >
                  <div
                     className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-screen overflow-y-auto no-scrollbar-guide`}
                  >
                     <Editor editable={false} initialData={data?.document} />
                  </div>

                  <Canvas
                     isPreview={true}
                     workspaceId={id}
                     userId={undefined}
                     socketRef={undefined}
                     initialShapes={data?.shapes}
                  />
               </div>
            </ChangeMode>
         </Suspense>
      </div>
   );
}
