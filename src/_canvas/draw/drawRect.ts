import { ShapeProps } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";
import { drawTextInsideShape } from "./drawText";

export function rectDraw({
   rect,
   context,
   isActive,
   showName,
   activeColor,
   tolerance = 6,
   massiveSelected,
   shouldRestore = true,
}: {
   rect: ShapeProps;
   isActive: boolean;
   tolerance?: number;
   showName?: boolean;
   activeColor?: string;
   shouldRestore?: boolean;
   massiveSelected?: boolean;
   context: CanvasRenderingContext2D;
}) {
   const { x, y, w, h, fill, dash, stroke, lineWidth, radius } = rect;
   const path = new Path2D();

   if (showName && rect.name) {
      context.beginPath();
      context.fillStyle = "white";
      context.font = `15px`;
      context.fillText(rect.name, x, y - 10);

      context.fill();
      context.closePath();
   }

   context.beginPath();

   context.rotate(rect.angle);
   let radi = radius;
   if (Math.abs(w) < 30 && Math.abs(h) < 30) {
      radi = 0;
   } else {
      radi = radius;
   }

   context.strokeStyle = stroke;
   context.setLineDash(dash);
   context.lineWidth = lineWidth;
   context.fillStyle = fill || "transparent";

   path.moveTo(x + radi, y);
   path.lineTo(x + w - radi, y);

   path.arcTo(x + w, y, x + w, y + radi, radi);
   path.lineTo(x + w, y + h - radi);

   path.arcTo(x + w, y + h, x + w - radi, y + h, radi);
   path.lineTo(x + radi, y + h);
   path.arcTo(x, y + h, x, y + h - radi, radi);
   path.lineTo(x, y + radi);
   path.arcTo(x, y, x + radi, y, radi);

   context.fill(path);
   context.stroke(path);
   context.setLineDash([0, 0]);
   context.closePath();

   /* render textI */
   drawTextInsideShape({ context, shape: rect });

   if (isActive && activeColor) {
      drawDotsAndRectActive({
         isMassiveSelected: !!massiveSelected,
         activeColor,
         tolerance,
         context,
         height: h,
         width: w,
         x,
         y,
      });
   }

   // renderText({ context: context, shape: rect, tolerance });
   if (shouldRestore) {
      context.restore();
   }
}
