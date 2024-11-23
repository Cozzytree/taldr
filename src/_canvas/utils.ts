import { CanvasShape } from "./canvasTypes";

const drawDotsAndRectActive = ({
   x,
   y,
   width,
   height,
   context,
   tolerance,
   activeColor,
   drawRect = true,
   isMassiveSelected,
}: {
   x: number;
   y: number;
   width: number;
   height: number;
   tolerance: number;
   drawRect?: boolean;
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

   if (drawRect) {
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
   }
};

const dots = ({
   ctx,
   sides,
   activeColor,
   shouldFill = false,
}: {
   activeColor: string;
   shouldFill?: boolean;
   sides: { x: number; y: number }[];
   ctx: CanvasRenderingContext2D;
}) => {
   for (let i = 0; i < sides.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.arc(sides[i].x, sides[i].y, 5, 0, 2 * Math.PI, false);
      if (shouldFill) ctx.fill();
      ctx.stroke();
      ctx.closePath();
   }
};

const adjustWithandHeightPoints = ({
   points,
}: {
   points: { x: number; y: number }[];
}) => {
   let x = Infinity; // initialize x and y as infinity
   let y = Infinity;
   let maxX = -Infinity;
   let maxY = -Infinity;
   points.forEach((p) => {
      if (x > p.x) {
         x = p.x;
      }
      if (maxX < p.x) {
         maxX = p.x;
      }
      if (y > p.y) {
         y = p.y;
      }
      if (maxY < p.y) {
         maxY = p.y;
      }
   });
   return { x, y, width: maxX - x, height: maxY - y };
};

const reEvaluateShape = (shape: CanvasShape) => {
   if (!shape) return;
   switch (shape.type) {
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
      case "pencil":
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
      default:
         shape.props.w = Math.max(shape.props.w, 20);
         shape.props.h = Math.max(shape.props.h, 20);
         break;
   }
};

const isInside = ({
   inner,
   outer,
}: {
   inner: { x: number; y: number; w: number; h: number };
   outer: { x: number; y: number; w: number; h: number };
}) => {
   return (
      inner.x >= outer.x &&
      inner.y >= outer.y &&
      inner.x + inner.w <= outer.x + outer.w &&
      inner.y + inner.h <= outer.y + outer.h
   );
};

const getOffsets = ({
   shape,
   mouseX,
   mouseY,
}: {
   shape: CanvasShape;
   mouseX: number;
   mouseY: number;
}) => {
   switch (shape.type) {
      case "ellipse":
         shape.props.offsetX = mouseX - shape.props.x;
         shape.props.offsetY = mouseY - shape.props.y;
         break;
      case "line":
         shape.props.offsetX = mouseX - shape.props.x;
         shape.props.offsetY = mouseY - shape.props.y;
         shape.props.points?.forEach((p) => {
            p.offsetX = mouseX - p.x;
            p.offsetY = mouseY - p.y;
         });
         break;
      case "pencil":
         shape.props.offsetX = mouseX - shape.props.x;
         shape.props.offsetY = mouseY - shape.props.y;
         shape.props.points?.forEach((p) => {
            p.offsetX = mouseX - p.x;
            p.offsetY = mouseY - p.y;
         });
         break;
      default:
         shape.props.offsetX = mouseX - shape.props.x;
         shape.props.offsetY = mouseY - shape.props.y;
         break;
   }
};

export {
   dots,
   isInside,
   getOffsets,
   reEvaluateShape,
   drawDotsAndRectActive,
   adjustWithandHeightPoints,
};
