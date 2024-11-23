import { ShapeProps } from "../canvasTypes";

const drawArrows = ({
   startPoint,
   endPoint,
   arrowLinght,
   ctx,
}: {
   startPoint: { x: number; y: number };
   endPoint: { x: number; y: number };
   arrowLinght: number;
   ctx: CanvasRenderingContext2D;
}) => {
   const arrowLength = arrowLinght;
   ctx.beginPath();

   // Draw the arrowhead
   const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x,
   );

   // First side of the arrowhead
   ctx.moveTo(endPoint.x, endPoint.y);
   ctx.lineTo(
      endPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
      endPoint.y - arrowLength * Math.sin(angle - Math.PI / 6),
   );
   ctx.stroke();
   ctx.closePath();

   // Second side of the arrowhead
   ctx.beginPath();
   ctx.moveTo(endPoint.x, endPoint.y);
   ctx.lineTo(
      endPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
      endPoint.y - arrowLength * Math.sin(angle + Math.PI / 6),
   );
   ctx.stroke();
   ctx.closePath();
};

const drawLine = ({
   ctx,
   shape,
   isActive,
   tempPoint,
   activeColor,
   tolerance = 6,
   massiveSelected,
   shouldRestore = true,
}: {
   tolerance?: number;
   shape: ShapeProps;
   isActive?: boolean;
   activeColor?: string;
   shouldRestore?: boolean;
   massiveSelected?: boolean;
   ctx: CanvasRenderingContext2D;
   tempPoint?: { x: number; y: number };
}) => {
   if (!shape.points) return;

   ctx.beginPath();
   ctx.strokeStyle = shape.stroke;
   ctx.lineWidth = shape.lineWidth;

   ctx.moveTo(shape.points[0].x, shape.points[0].y);

   if (tempPoint) {
      ctx.lineTo(tempPoint.x, tempPoint.y);
   } else {
      ctx.lineTo(shape.points[1].x, shape.points[1].y);
   }

   ctx.stroke();
   ctx.closePath();

   if (shape.arrowE) {
      drawArrows({
         startPoint: shape.points[0],
         endPoint: tempPoint ? tempPoint : shape.points[1],
         arrowLinght: 10,
         ctx,
      });
   } else {
      drawArrows({
         startPoint: tempPoint ? tempPoint : shape.points[1],
         endPoint: shape.points[0],
         arrowLinght: 10,
         ctx,
      });
   }

   // if (isActive && activeColor) {
   //    ctx.beginPath();
   //    ctx.strokeStyle = activeColor;
   //    ctx.lineWidth = shape.lineWidth;
   //    ctx.moveTo(shape.points[0].x, shape.points[0].y);
   //    ctx.lineTo(shape.points[1].x, shape.points[1].y);
   //    ctx.stroke();
   //    ctx.closePath();
   // }

   if (shouldRestore) {
      ctx.restore();
   }
};

export { drawLine, drawArrows };
