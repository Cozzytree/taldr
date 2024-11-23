import { ShapeProps } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";

const drawPencil = ({
   shape,
   ctx,
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
   if (!shape.points) return;
   // draw a basic circle instead
   if (shape.points.length < 6) {
      const b = shape.points[0];
      ctx.beginPath();
      ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      ctx.closePath();
      ctx.fill();
      return;
   }
   ctx.beginPath();
   ctx.strokeStyle = shape.stroke;
   ctx.lineWidth = shape.lineWidth;
   ctx.moveTo(shape.points[0].x, shape.points[0].y);
   // draw a bunch of quadratics, using the average of two shape.points as the control point
   let i;
   for (i = 1; i < shape.points.length - 2; i++) {
      const c = (shape.points[i].x + shape.points[i + 1].x) / 2;
      const d = (shape.points[i].y + shape.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(shape.points[i].x, shape.points[i].y, c, d);
   }
   ctx.quadraticCurveTo(
      shape.points[i].x,
      shape.points[i].y,
      shape.points[i + 1].x,
      shape.points[i + 1].y,
   );
   ctx.stroke();

   if (isActive && activeColor) {
      drawDotsAndRectActive({
         tolerance,
         x: shape.x,
         y: shape.y,
         activeColor,
         context: ctx,
         width: shape.w,
         height: shape.h,
         isMassiveSelected: !!massiveSelected,
      });
   }

   if (shouldRestore) {
      ctx.restore();
   }
};

export { drawPencil };
