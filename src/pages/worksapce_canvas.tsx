import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Editor from "@/components/editor";

const Canvas = lazy(() => import("@/_canvas/canvas"));
import { CanvasShape } from "@/_canvas/canvasTypes";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import ChangeMode from "@/components/changeMode";
import { cn, Mode } from "@/lib/utils";

interface Workspace {
  shapes: CanvasShape[];
  _id: string;
  description: string;
  name: string;
  userId: string;
}

const useGetShapes = (workspaceId: string) => {
  const [isLoading, setloading] = useState(false);

  const [data, setData] = useState<Workspace | null>(null);

  const fetchShapes = useCallback(async () => {
    setloading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/workspace_data/${workspaceId}`,
        {
          method: "GET",
        },
      );
      const data = await res.json();
      setData(data);
    } catch (err: any) {
      throw new Error(err.message || "internal server error");
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
    socketRef.current = new WebSocket("ws://localhost:8080/ws");

    if (socketRef?.current) {
      socketRef.current.addEventListener("open", () => {
        console.log("connected");
      });

      socketRef.current.addEventListener("message", (data) => {
        console.log("data ", JSON.parse(data.data));
      });
    }

    return () => {
      socketRef.current?.close();
    };
  }, []);

  if (isLoading && !isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading
      </div>
    );
  }

  if (!user?.id) {
    navigate({ to: "/trial" });
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
          loading canvas
        </div>
      }
    >
      <ChangeMode mode={mode} setMode={setMode}>
        <div
          className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
        >
          <div
            className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-full overflow-y-auto no-scrollbar-guide`}
          >
            <Editor />
          </div>
          <div className={cn(mode === "editor" && "hidden")}>
            <Canvas
              workspaceId={id}
              userId={user?.id}
              socketRef={socketRef}
              initialShapes={data?.shapes}
            />
          </div>
        </div>
      </ChangeMode>
    </Suspense>
  );
}
