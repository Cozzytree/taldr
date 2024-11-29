import { lazy, Suspense } from "react";

const Canvas = lazy(() => import("@/_canvas/canvas"));

export default function TrialRoute() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="h-full w-full text-sm text-foreground/60 flex justify-center items-center">
            Loading...
          </div>
        }
      >
        <Canvas
          initialShapes={[]}
          socketRef={undefined}
          userId={undefined}
          workspaceId={undefined}
        />
      </Suspense>
    </div>
  );
}
