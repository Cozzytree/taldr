import { CanvasShape } from "./canvasTypes";

const drawDotsAndRectActive = ({
   x,
   y,
   width,
   height,
   context,
   tolerance,
   activeColor,
   isMassiveSelected,
}: {
   x: number;
   y: number;
   width: number;
   height: number;
   tolerance: number;
   activeColor: string;
   isMassiveSelected: boolean;
   context: CanvasRenderingContext2D;
}) => {
   // Draw dots
   if (!isMassiveSelected)
      dots({
         sides: [
            { x: x - tolerance, y: y - tolerance },
            { x: x + width + tolerance, y: y - tolerance },
            { x: x + width + tolerance, y: y + height + tolerance },
            { x: x - tolerance, y: y + height + tolerance },
         ],
         activeColor,
         ctx: context,
      });

   // Draw active rectangle
   context.beginPath();
   context.strokeStyle = activeColor;
   context.lineWidth = 2;
   // context.setLineDash([5, 5]);
   context.rect(
      x - tolerance,
      y - tolerance,
      width + 2 * tolerance,
      height + 2 * tolerance,
   );
   context.stroke();
   context.closePath();
};

const dots = ({
   ctx,
   sides,
   activeColor,
}: {
   activeColor: string;
   sides: { x: number; y: number }[];
   ctx: CanvasRenderingContext2D;
}) => {
   for (let i = 0; i < sides.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.arc(sides[i].x, sides[i].y, 5, 0, 2 * Math.PI, false);
      // ctx.fill();
      ctx.stroke();
      ctx.closePath();
   }
};

const adjustWithandHeightPoints = ({
   points,
}: {
   points: { x: number; y: number }[];
}) => {
   let x = points[0].x;
   let y = points[0].y;
   let width = 0;
   let height = 0;

   points.forEach((p) => {
      if (p.x < x) {
         width = x - p.x;
         x = p.x;
      } else {
         width = p.x - x;
      }

      if (p.y < y) {
         height = y - p.y;
         y = p.y;
      } else {
         height = p.y - y;
      }
   });

   return { x, y, width, height };
};

const reEvaluateShape = (shape: CanvasShape) => {
   if (!shape) return;
   switch (shape.type) {
      case "rect":
         shape.props.w = Math.max(shape.props.w, 20);
         shape.props.h = Math.max(shape.props.h, 20);
         break;
      case "ellipse":
         shape.props.xRadius = Math.max(shape.props.xRadius ?? 0, 20);
         shape.props.yRadius = Math.max(shape.props.yRadius ?? 0, 20);
         shape.props.w = 2 * (shape.props.xRadius ?? 0);
         shape.props.h = 2 * (shape.props.yRadius ?? 0);
         break;
      case "line":
         if (shape.props.points) {
            const { width, height, x, y } = adjustWithandHeightPoints({
               points: shape.props.points,
            });
            shape.props.x = x;
            shape.props.y = y;
            shape.props.w = width;
            shape.props.h = height;
         }
         break;
   }
};

export {
   dots,
   drawDotsAndRectActive,
   adjustWithandHeightPoints,
   reEvaluateShape,
};
