import { useEffect, useRef, useState } from "react";
import CanvasOptions from "./_components/canvasOptions";
import ChangeModes from "./_components/changeModes";
import CanvasClass from "./canvasClass";
import { cConf } from "./canvasConfig";
import { CanvasShape, modes } from "./canvasTypes";

const Canvas = ({ initialShapes }: { initialShapes: CanvasShape[] | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<CanvasClass | null>(null);
  const [activeShapes, setActiveShape] = useState(0);
  const [mode, setMode] = useState<modes>("pointer");

  useEffect(() => {
    if (!canvasRef.current || !fallbackCanvasRef.current) return;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    fallbackCanvasRef.current.width = window.innerWidth;
    fallbackCanvasRef.current.height = window.innerHeight;

    const init = new CanvasClass({
      canvas: canvasRef.current,
      fallbackCanvas: fallbackCanvasRef.current,
      onChange: ({ activeShapes, currentMode, shapes }) => {
        setActiveShape(activeShapes.size);
      },
      afterNewShape: ({ mode, shape }) => {
        setMode(mode);
      },
    });

    if (initialShapes) {
      initialShapes.forEach((s) => {
        init.findEmptyIndexAndInsert(s);
      });
    }

    canvas.current = init;

    init.initialize();

    return () => {
      init.cleanup();
    };
  }, [initialShapes]);

  return (
    <>
      <ChangeModes
        currMode={mode}
        changeMode={(mode) => {
          cConf.currMode = mode;
          cConf.activeShapes.clear();
          setMode(mode);
        }}
      />

      {activeShapes > 0 && <CanvasOptions canvas={canvas} />}

      <canvas
        className="absolute top-0 left-0 bg-background"
        ref={fallbackCanvasRef}
      ></canvas>
      <canvas
        className="absolute top-0 left-0 bg-transparent z-50"
        ref={canvasRef}
      ></canvas>
    </>
  );
};

export default Canvas;
