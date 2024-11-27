import { lazy, Suspense, useCallback, useEffect, useState } from "react";

const Canvas = lazy(() => import("@/_canvas/canvas"));
import { CanvasShape } from "@/_canvas/canvasTypes";
import { useParams } from "@tanstack/react-router";

const useGetShapes = (workspaceId: string) => {
  const [isLoading, setloading] = useState(false);
  const [data, setData] = useState<CanvasShape | null>(null);

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
  const { id } = useParams({ strict: false });
  const { data, isLoading } = useGetShapes(id || "");

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading
      </div>
    );
  }

  return (
    <div className="h-screen w=full">
      <Suspense
        fallback={
          <div className="min-h-screen w-full text-sm text-foreground/60 flex justify-center items-center">
            loading canvas
          </div>
        }
      >
        <Canvas initialShapes={data} />
      </Suspense>
    </div>
  );
}
