import { ShapeProps } from "../canvasTypes";
import { dots } from "../utils";
import { drawTextInsideShape } from "./drawText";

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
   ctx.setLineDash(shape.dash);

   ctx.moveTo(shape.points[0].x, shape.points[0].y);

   if (tempPoint) {
      ctx.lineTo(tempPoint.x, tempPoint.y);
   } else {
      ctx.lineTo(shape.points[1].x, shape.points[1].y);
   }

   ctx.setLineDash([0, 0]);
   ctx.stroke();
   ctx.closePath();

   if (shape.arrowE) {
      drawArrows({
         startPoint: shape.points[0],
         endPoint: tempPoint ? tempPoint : shape.points[1],
         arrowLinght: 10,
         ctx,
      });
   }
   if (shape.arrowS) {
      drawArrows({
         startPoint: tempPoint ? tempPoint : shape.points[1],
         endPoint: shape.points[0],
         arrowLinght: 10,
         ctx,
      });
   }

   /* render textI */
   drawTextInsideShape({ context: ctx, shape });

   if (isActive && activeColor) {
      dots({
         ctx,
         sides: [
            { x: shape.points[0].x, y: shape.points[0].y },
            { x: shape.points[1].x, y: shape.points[1].y },
         ],
         activeColor,
         shouldFill: true,
      });

      if (shape.startShape) {
         ctx.setLineDash([5, 5]);
         ctx.lineWidth = 1.5;

         ctx.moveTo(shape.points[0].x, shape.points[0].y);
         ctx.lineTo(
            shape.startShape.followPoint.x,
            shape.startShape.followPoint.y,
         );

         ctx.fillStyle = "red";
         ctx.arc(
            shape.startShape.followPoint.x,
            shape.startShape.followPoint.y,
            4,
            0,
            2 * Math.PI,
         );
         ctx.fill();
         ctx.stroke();
         ctx.setLineDash([]);
      }

      if (shape.endShape) {
         ctx.fillStyle = "red";
         ctx.setLineDash([5, 5]);
         ctx.lineWidth = 1.5;

         ctx.moveTo(
            shape.points[shape.points.length - 1].x,
            shape.points[shape.points.length - 1].y,
         );
         ctx.lineTo(shape.endShape.followPoint.x, shape.endShape.followPoint.y);

         ctx.arc(
            shape.endShape.followPoint.x,
            shape.endShape.followPoint.y,
            4,
            0,
            2 * Math.PI,
         );
         ctx.fill();
         ctx.stroke();
         ctx.setLineDash([]);
      }
   }

   if (shouldRestore) {
      ctx.restore();
   }
};

export { drawLine, drawArrows };
