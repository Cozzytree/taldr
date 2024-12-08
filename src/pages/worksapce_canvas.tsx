import { lazy, Suspense, useEffect, useState } from "react";

import { CanvasShape } from "@/_canvas/canvasTypes";
import ChangeMode from "@/components/changeMode";
import { cn, Mode } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { Timeout } from "node_modules/@tanstack/react-router/dist/esm/utils";
const Canvas = lazy(() => import("@/_canvas/canvas"));
const Editor = lazy(() => import("@/components/editor"));

export default function WorkspaceCanvas() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { id } = useParams({ strict: false });
  const [mode, setMode] = useState<Mode>("canvas");
  const workspaceData = useQuery(api.workspaces.getWorkspace, {
    id: (id as Id<"workspaces">) || ("" as Id<"workspaces">),
    userId: user?.id || "",
  });
  const updateName = useMutation(api.workspaces.updateWorkspaceName);
  const updateShapes = useMutation(api.workspaces.updateShapes);
  const updateDocument = useMutation(api.workspaces.updateDocument);

  useEffect(() => {
    if (!user?.id && isLoaded) {
      navigate({ to: "/trial" });
    }
  }, [user, navigate, isLoaded]);

  if (!workspaceData || !isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const handleUpdateShapes = () => {
    let timer: Timeout;
    return (shapes: CanvasShape[]) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        if (!user?.id || !id) return;
        updateShapes({
          userId: user.id,
          workspaceId: id as Id<"workspaces">,
          shapes: JSON.stringify(shapes),
        });
      }, 300);
    };
  };

  const handleUpdateName = () => {
    let timer: Timeout;
    return (name: string) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (!user?.id || !id) return;
        updateName({ userId: user.id, id: id as Id<"workspaces">, name });
      }, 300);
    };
  };

  const handleUpdateDocument = () => {
    let timer: Timeout;
    return (document: string) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (!user?.id || !id) return;
        updateDocument({
          document,
          userId: user.id,
          workspaceId: id as Id<"workspaces">,
        });
      }, 300);
    };
  };

  const shapes: CanvasShape[] =
    workspaceData.shapes.length > 0 ? JSON.parse(workspaceData.shapes) : [];

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <ChangeMode
        updateName={handleUpdateName}
        isTrial={false}
        mode={mode}
        setMode={setMode}
        name={workspaceData.name}
      >
        <div
          className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
        >
          <div
            className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-[94vh] overflow-y-auto no-scrollbar-guide bg-accent/80 mt-1 rounded-md m-2`}
          >
            <Editor
              id={id}
              userId={user?.id}
              initialData={workspaceData?.document}
              handleUpdateDocument={handleUpdateDocument}
            />
          </div>
          <div className={cn(mode === "editor" && "hidden")}>
            <Canvas
              workspaceId={id}
              userId={user?.id}
              handleUpdateShapes={handleUpdateShapes}
              initialShapes={shapes}
            />
          </div>
        </div>
      </ChangeMode>
    </Suspense>
  );
}
