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
import { LoaderCircle } from "lucide-react";
import { useUpdateName } from "@/api/workspace";

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
            `${
               import.meta.env.VITE_MODE === "development"
                  ? "http://localhost:8080"
                  : import.meta.env.VITE_API_URL
            }/workspace_data/${workspaceId}`,
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
   const { mutate, isLoading: updatingName } = useUpdateName();
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
      const url =
         import.meta.env.VITE_MODE === "development"
            ? `ws://localhost:8080/ws`
            : `ws://${import.meta.env.VITE_SOCKET_IP}/ws`;
      socketRef.current = new WebSocket(url);

      if (socketRef?.current) {
         socketRef.current.addEventListener("open", () => {
            toast.success("connected");
         });

         socketRef.current.addEventListener("message", () => {});

         socketRef.current.addEventListener("error", (err: unknown) => {
            if (err instanceof Error) {
               toast.error(`disconnected : ${err.message || "error"}`);
            }
         });
      }

      return () => {
         socketRef.current?.close();
      };
   }, []);

   if (isLoading || !isLoaded) {
      return (
         <div className="w-full h-screen flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
         </div>
      );
   }

   let timer: NodeJS.Timeout;
   const handleSaveDocument = (d: string) => {
      if (!socketRef.current || !user?.id || !id) return;

      if (timer) {
         clearTimeout(timer); // Clear the existing timer if there's one already set
      }

      // Set a new timeout
      timer = setTimeout(() => {
         socketRef.current?.send(
            JSON.stringify({
               id,
               type: "doc",
               document: d,
               userId: user.id,
            }),
         );
      }, 200); // Delay of 300ms before sending the document
   };

   return (
      <Suspense
         fallback={
            <div className="min-h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
               <LoaderCircle className="animate-spin" />
            </div>
         }
      >
         <ChangeMode
            onBlur={(n: string) => {
               if (!id || !user?.id || !id) return;
               mutate({ workspaceId: id, name: n, userId: user?.id });
            }}
            updating={updatingName}
            isTrial={false}
            mode={mode}
            setMode={setMode}
            name={data?.name}
         >
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
                     getDocumentData={handleSaveDocument}
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
