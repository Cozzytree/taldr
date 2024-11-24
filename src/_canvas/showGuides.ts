import { ShapeProps } from "./canvasTypes";

const createGuide = ({
   ctx,
   guide,
   shape,
}: {
   shape: ShapeProps;
   ctx: CanvasRenderingContext2D;
   guide: { x: number; y: number; w: number; h: number };
}) => {
   const d = 5;

   const guideMidX = guide.x + guide.w * 0.5;
   const guideMidY = guide.y + guide.h * 0.5;
   const shapeMidX = shape.x + shape.w * 0.5;
   const shapeMidY = shape.y + shape.h * 0.5;

   /* y's */
   if (Math.abs(shape.y - guide.y) <= d) {
      showLine(
         ctx,
         { x: guideMidX, y: guide.y },
         { x: shapeMidX, y: guide.y },
         { x: guideMidX, y: guide.y },
         { x: shapeMidX, y: guide.y },
      );
      shape.y = guide.y;

      return true;
   } else if (Math.abs(guideMidY - shape.y) <= d) {
      showLine(
         ctx,
         { x: guideMidX, y: guideMidY },
         { x: shapeMidX, y: guideMidY },
         { x: guideMidX, y: guideMidY },
         { x: shapeMidX, y: guideMidY },
      );

      shape.y = guideMidY;
      return true;
   } else if (Math.abs(shape.y - (guide.y + guide.h)) <= d) {
      showLine(
         ctx,
         { x: guideMidX, y: guide.y + guide.h },
         { x: shapeMidX, y: guide.y + guide.h },
         { x: guideMidX, y: guide.y + guide.h },
         { x: shapeMidX, y: guide.y + guide.h },
      );
      shape.y = guide.y + guide.h;

      return true;
   } /* x's */ else if (Math.abs(shape.x - guide.x) <= d) {
      showLine(
         ctx,
         { x: guide.x, y: guideMidY },
         { x: guide.x, y: shapeMidY },
         { x: guide.x, y: guideMidY },
         { x: guide.x, y: shapeMidY },
      );

      shape.x = guide.x;

      return true;
   } else if (Math.abs(shape.x - guideMidX) <= 10) {
      showLine(
         ctx,
         { x: guideMidX, y: guideMidY },
         { x: guideMidX, y: shapeMidY },
         { x: guideMidX, y: guideMidY },
         { x: guideMidX, y: shapeMidY },
      );
      shape.x = guideMidX;
      return true;
   } else if (Math.abs(shape.x - (guide.x + guide.w)) <= d) {
      showLine(
         ctx,
         { x: guide.x + guide.w, y: guideMidY },
         { x: guide.x + guide.w, y: shapeMidY },
         { x: guide.x + guide.w, y: guideMidY },
         { x: guide.x + guide.w, y: shapeMidY },
      );
      shape.x = guide.x + guide.w;
      return true;
   }

   return false;
};

const showLine = (
   ctx: CanvasRenderingContext2D,
   dot_1: { x: number; y: number },
   dot_2: { x: number; y: number },
   move: { x: number; y: number },
   to: { x: number; y: number },
) => {
   ctx.beginPath();
   ctx.arc(dot_1.x, dot_1.y, 4, 0, 2 * Math.PI);
   ctx.closePath();

   ctx.beginPath();
   ctx.arc(dot_2.x, dot_2.y, 4, 0, 2 * Math.PI);
   ctx.closePath();

   ctx.moveTo(move.x, move.y);
   ctx.lineTo(to.x, to.y);
};

export { createGuide };
