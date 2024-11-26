import { ShapeProps } from "../canvasTypes";
import { dots, drawDotsAndRectActive } from "../utils";

const drawText = ({
   shape,
   context,
   isActive,
   activeColor,
   tolerance = 6,
   shouldRestore = true,
   massiveSelected = false,
}: {
   tolerance?: number;
   shape: ShapeProps;
   isActive?: boolean;
   activeColor?: string;
   shouldRestore?: boolean;
   context: CanvasRenderingContext2D;
   massiveSelected?: boolean;
}) => {
   context.beginPath();
   context.fillStyle = shape.stroke;
   const texts = shape.text.split("\n");
   context.textAlign = shape.textAlign;
   context.font = `${shape.fontSize}px Arial`;

   // const maxHeight = texts.length * shape.fontSize;
   let startX: number;
   if (shape.textAlign === "left" || shape.textAlign === "right") {
      startX = shape.x;
   } else if (shape.textAlign === "center") {
      startX = shape.x + shape.w / 2;
   }

   let maxHeight = shape.y + shape.fontSize;

   texts.forEach((text) => {
      if (text === "") return;
      context.fillText(text, startX, maxHeight, shape.w);
      maxHeight += shape.fontSize;
   });
   shape.h = maxHeight - shape.y - tolerance;

   context.fill();
   context.closePath();

   if (isActive && activeColor) {
      dots({
         ctx: context,
         sides: [
            {
               x: shape.x + shape.w + tolerance,
               y: shape.y + shape.h + tolerance,
            },
         ],
         activeColor,
         shouldFill: true,
      });
      context.beginPath();
      context.fillStyle = activeColor;
      context.lineWidth = 2;
      context.rect(
         shape.x - tolerance,
         shape.y - tolerance,
         shape.w + tolerance * 2,
         shape.h + tolerance * 2,
      );
      context.stroke();
      context.closePath();
   }

   if (shouldRestore) {
      context.restore();
   }
};

export const drawTextInsideShape = ({
   shape,
   context,
}: {
   shape: ShapeProps;
   context: CanvasRenderingContext2D;
}) => {
   if (!shape.text) return;

   context.beginPath();
   const chunks = shape.text.split("\n");
   context.font = `${shape.fontSize}px Arial`;
   context.fillStyle = shape.stroke;
   context.textAlign = shape.textAlign;

   let yPoint = shape.y + shape.h * 0.5 - chunks.length;

   chunks.forEach((c) => {
      let xPoint;
      if (shape.textAlign === "center") {
         xPoint = shape.x + shape.w / 2;
      } else {
         xPoint = shape.x;
      }

      context.fillText(c, xPoint, yPoint, shape.w);
      yPoint += shape.fontSize * 0.3;
   });
   context.fill();
   context.closePath();
};

export default drawText;
