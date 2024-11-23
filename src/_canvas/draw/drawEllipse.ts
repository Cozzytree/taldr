import { ShapeProps } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";

const drawEllipse = ({
   ctx,
   shape,
   isActive,
   activeColor,
   tolerance = 6,
   massiveSelected,
   shouldRestore = true,
}: {
   shape: ShapeProps;
   tolerance?: number;
   isActive?: boolean;
   activeColor?: string;
   shouldRestore?: boolean;
   massiveSelected?: boolean;
   ctx: CanvasRenderingContext2D;
}) => {
   ctx.beginPath();

   ctx.fillStyle = shape.fill;
   ctx.strokeStyle = shape.stroke;
   ctx.lineWidth = shape.lineWidth;
   ctx.lineWidth = shape.lineWidth;

   ctx.ellipse(
      shape.x,
      shape.y,
      shape.xRadius ?? 0,
      shape.yRadius ?? 0,
      0,
      0,
      360,
      false,
   );

   ctx.fill();
   ctx.stroke();
   ctx.closePath();

   if (isActive && activeColor) {
      drawDotsAndRectActive({
         context: ctx,
         activeColor,
         tolerance,
         x: shape.x - (shape.xRadius ?? 0),
         y: shape.y - (shape.yRadius ?? 0),
         height: shape.h,
         width: shape.w,
         isMassiveSelected: !!massiveSelected,
      });
   }

   if (shouldRestore) {
      ctx.restore();
   }
};

export { drawEllipse };
