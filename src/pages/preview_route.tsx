import { lazy, Suspense } from "react";
const Canvas = lazy(() => import("@/_canvas/canvas"));
const Editor = lazy(() => import("@/components/editor"));
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { LoaderCircle, LoaderIcon } from "lucide-react";
import { Mode } from "@/lib/utils";
import ChangeMode from "@/components/changeMode";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";

export default function Preview() {
  const { id } = useParams({ strict: false });
  const [mode, setMode] = useState<Mode>("canvas");
  const workspacedata = useQuery(api.workspaces.getWorkspace, {
    id: id as Id<"workspaces">,
  });

  if (!workspacedata) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-sm text-foreground/70">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const shapes = workspacedata.shapes.length
    ? JSON.parse(workspacedata.shapes)
    : [];

  return (
    <div className="min-h-screen w-full">
      <Suspense
        fallback={
          <div className="w-full h-screen flex justify-center items-center text-sm text-foreground/70">
            <LoaderCircle className="animate-spin" />
          </div>
        }
      >
        <ChangeMode
          isTrial
          mode={mode}
          setMode={setMode}
          name={workspacedata.name}
        >
          <div
            className={`h-full w-screen grid ${mode === "both" ? "grid-cols-[0.6fr_1fr]" : "grid-cols-1"} overflow-hidden divide-x`}
          >
            <div
              className={`${mode === "canvas" ? "hidden" : "grid"} grid-rows-[auto_1fr] h-screen overflow-y-auto no-scrollbar-guide`}
            >
              <Editor editable={false} initialData={workspacedata?.document} />
            </div>

            <Canvas
              isPreview={true}
              workspaceId={id}
              userId={undefined}
              socketRef={undefined}
              initialShapes={shapes}
            />
          </div>
        </ChangeMode>
      </Suspense>
    </div>
  );
}
