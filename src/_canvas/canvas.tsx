import { useEffect, useRef, useState } from "react";
import CanvasClass from "./canvasClass";
import ChangeModes from "./_components/changeModes";
import { modes } from "./canvasTypes";
import { cConf } from "./canvasConfig";
import CanvasOptions from "./_components/canvasOptions";

const Canvas = () => {
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
      canvas.current = init;

      init.initialize();

      return () => {
         init.cleanup();
      };
   }, []);

   return (
      <>
         <ChangeModes
            currMode={mode}
            changeMode={(mode) => {
               cConf.currMode = mode;
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
