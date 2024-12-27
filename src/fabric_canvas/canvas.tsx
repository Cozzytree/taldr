import { useTheme } from "@/components/theme-provider";
import { Mode } from "@/lib/utils";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";

const FabricCanvas = ({ mode }: { mode: Mode }) => {
  const { theme } = useTheme();
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const canvasE = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasE.current) return;

    const c = new fabric.Canvas(canvasE.current, {
      width: window.innerWidth,
      height: window.innerWidth,
      backgroundColor: theme === "dark" ? "#000000" : "#fffff",
    });

    c.add(
      new fabric.Rect({
        rx: 10,
        ry: 10,
        width: 100,
        height: 100,
        cornerSize: 8,
        stroke: "white",
        strokeWidth: 3,
        cornerStyle: "circle",
      }),
    );

    fabricRef.current = c;

    return () => {
      c.dispose();
    };
  }, [theme, mode]);

  return <canvas className="w-full h-screen" ref={canvasE}></canvas>;
};

export default FabricCanvas;
