import {
   lazy,
   Suspense,
   useCallback,
   useEffect,
   useRef,
   useState,
} from "react";

import { cn, Mode } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import ChangeMode from "@/components/changeMode";
import { CanvasShape } from "@/_canvas/canvasTypes";
const Canvas = lazy(() => import("@/_canvas/canvas"));
const Editor = lazy(() => import("@/components/editor"));
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";

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

export default function WorkspaceCanvas() {
   const navigate = useNavigate();
   const [mode, setMode] = useState<Mode>("canvas");
   const { user, isLoaded } = useUser();
   const { id } = useParams({ strict: false });
   const { data, isLoading } = useGetShapes(id || "");
   const socketRef = useRef<WebSocket | undefined>(undefined);

   useEffect(() => {
      if (!user?.id && isLoaded) {
         navigate({ to: "/trial" });
      }
   }, [user, navigate, isLoaded]);

   useEffect(() => {
      socketRef.current = new WebSocket("ws://localhost:8080/ws");

      if (socketRef?.current) {
         socketRef.current.addEventListener("open", () => {
            toast.success("connected");
         });

         socketRef.current.addEventListener("message", () => {
            // console.log("data ", JSON.parse(data.data));
         });
      }

      return () => {
         socketRef.current?.close();
      };
   }, []);

   if (isLoading || !isLoaded) {
      return (
         <div className="w-full h-screen flex justify-center items-center">
            <RefreshCcw className="animate-spin" />
         </div>
      );
   }

   return (
      <Suspense
         fallback={
            <div className="min-h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
               <RefreshCcw className="animate-spin" />
            </div>
         }
      >
         <ChangeMode mode={mode} setMode={setMode} name={data?.name}>
            <div
               className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
            >
               <div
                  className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-screen overflow-y-auto no-scrollbar-guide`}
               >
                  <Editor
                     id={id}
                     userId={user?.id}
                     initialData={data?.document}
                     socket={socketRef.current}
                  />
               </div>
               <div className={cn(mode === "editor" && "hidden")}>
                  <Canvas
                     workspaceId={id}
                     userId={user?.id}
                     socketRef={socketRef.current}
                     initialShapes={data?.shapes}
                  />
               </div>
            </div>
         </ChangeMode>
      </Suspense>
   );
}
