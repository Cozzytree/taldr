import CanvasOptions from "./_components/canvasOptions";
import { useEffect, useRef, useState } from "react";
import ChangeModes from "./_components/changeModes";
import { CanvasShape, modes } from "./canvasTypes";
import CanvasClass from "./canvasClass";
import { cConf } from "./canvasConfig";
import {
   Menubar,
   MenubarContent,
   MenubarItem,
   MenubarMenu,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const Canvas = ({
   userId,
   socketRef,
   workspaceId,
   initialShapes,
}: {
   userId?: string;
   workspaceId?: string;
   initialShapes?: CanvasShape[] | undefined;
   socketRef?: WebSocket;
}) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
   const canvas = useRef<CanvasClass | null>(null);
   const [activeShapes, setActiveShape] = useState(0);
   const [mode, setMode] = useState<modes>("pointer");
   const [scale, setScale] = useState(cConf.scale.x);

   useEffect(() => {
      if (!canvasRef.current || !fallbackCanvasRef.current) return;

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      fallbackCanvasRef.current.width = window.innerWidth;
      fallbackCanvasRef.current.height = window.innerHeight;

      const init = new CanvasClass({
         initialShapes,
         canvas: canvasRef.current,
         fallbackCanvas: fallbackCanvasRef.current,
         onChange: ({ activeShapes, currentMode }) => {
            setActiveShape(activeShapes.size);
            setMode(currentMode);
            setScale(cConf.scale.x);
         },
         updateaftermouseup: ({ shapes }) => {
            if (!userId || !workspaceId || !socketRef) return;
            if (socketRef.readyState === WebSocket.OPEN) {
               socketRef.send(
                  JSON.stringify({
                     id: workspaceId,
                     type: "canvas",
                     shapes: shapes,
                     userId: userId,
                  }),
               );
            } else {
               throw new Error("error while sending data to server");
            }
         },
      });

      canvas.current = init;
      init.initialize();

      init.draw();

      return () => {
         init.draw();
         init.cleanup(); // Ensure CanvasClass is properly cleaned up
      };
   }, [workspaceId, userId, socketRef]);

   const handleZoomInOut = (val: number) => {
      if (!canvas.current) return;
      if (val == 1) {
         cConf.scale.x *= 1.1;
         cConf.scale.y *= 1.1;
      } else {
         if (!canvas.current || cConf.scale.x <= 0.6) return;
         cConf.scale.x /= 1.1;
         cConf.scale.y /= 1.1;
      }
      cConf.scale.x = Math.round(cConf.scale.x * 10) / 10;
      cConf.scale.y = Math.round(cConf.scale.y * 10) / 10;
      canvas.current.draw();

      setScale(cConf.scale.x);
   };

   return (
      <div id="canvas-div" className={`relative w-full h-screen`}>
         <main className="w-full h-full">
            <ChangeModes
               currMode={mode}
               changeMode={(mode) => {
                  cConf.currMode = mode;
                  cConf.activeShapes.clear();
                  setMode(mode);
               }}
            />

            <Menubar>
               <MenubarMenu>
                  <MenubarTrigger asChild>
                     <Button
                        className="absolute right-5 top-5 z-[100]"
                        variant={"outline"}
                        size={"sm"}
                     >
                        {(scale * 100).toFixed(0)} %
                     </Button>
                  </MenubarTrigger>
                  <MenubarContent side="left" align="start">
                     <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                        <Button
                           onClick={() => handleZoomInOut(0)}
                           size="sm"
                           variant={"ghost"}
                        >
                           <Minus />
                        </Button>
                        <span className="w-12">
                           {" "}
                           {(scale * 100).toFixed(0)} %
                        </span>
                        <Button
                           onClick={() => handleZoomInOut(1)}
                           size="sm"
                           variant={"ghost"}
                        >
                           <Plus />
                        </Button>
                     </div>
                     <MenubarItem
                        onClick={() => {
                           if (!canvas.current) return;
                           if (cConf.offset.x !== 0 || cConf.offset.y !== 0) {
                              cConf.offset = { x: 0, y: 0 };
                              canvas.current.draw();
                           }
                        }}
                     >
                        Center canvas
                     </MenubarItem>
                  </MenubarContent>
               </MenubarMenu>
            </Menubar>

            {activeShapes > 0 && mode !== "hands_free" && (
               <CanvasOptions canvas={canvas} activesShapes={activeShapes} />
            )}

            <canvas
               className="absolute top-0 left-0 bg-background transition-all duration-200"
               ref={fallbackCanvasRef}
            ></canvas>
            <canvas
               className="absolute top-0 left-0 z-50 transition-all duration-200"
               ref={canvasRef}
            ></canvas>
         </main>
      </div>
   );
};

export default Canvas;
