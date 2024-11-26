import { Menubar } from "@/components/ui/menubar";
import FontSizeoption from "./fontsizeOption";
import Stroke_Option from "./strokeOption";
import DashedOption from "./dashedOption";
import CanvasClass from "../canvasClass";
import { cConf } from "../canvasConfig";
import FillOption from "./fillOption";

export default function CanvasOptions({
   canvas,
}: {
   canvas: React.MutableRefObject<CanvasClass | null>;
}) {
   const handleColor = (color: string) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            if (
               canvas.current.canvasShapes[i].type === "line" ||
               canvas.current.canvasShapes[i].type === "pencil" ||
               canvas.current.canvasShapes[i].type === "text"
            ) {
               canvas.current.canvasShapes[i].props.stroke = color;
            } else {
               canvas.current.canvasShapes[i].props.fill = color;
            }
         }

         canvas.current.draw();
      }
   };

   const handleStroke = (stroke: number) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.lineWidth = stroke;
         }

         canvas.current.draw();
      }
   };

   const handleStrokeColor = (color: string) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.stroke = color;
         }

         canvas.current.draw();
      }
   };

   const handleDashed = (v: [number, number]) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.dash = v;
         }

         canvas.current.draw();
      }
   };

   const handleFontSize = (v: number) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.fontSize = v;
         }

         canvas.current.draw();
      }
   };

   return (
      <div className="fixed z-[100] bottom-10 w-full flex items-center justify-center">
         <Menubar>
            <FillOption handleColor={handleColor} />
            <Stroke_Option
               handleStroke={handleStroke}
               handleStrokeColor={handleStrokeColor}
            />
            <DashedOption handleDashed={handleDashed} />
            <FontSizeoption handleFontSize={handleFontSize} />
         </Menubar>
      </div>
   );
}
