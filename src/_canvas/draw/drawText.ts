import { ShapeProps } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";

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
   shape.h = maxHeight - shape.y - shape.fontSize;

   context.fill();
   context.closePath();

   if (isActive && activeColor) {
      drawDotsAndRectActive({
         context,
         tolerance,
         x: shape.x,
         y: shape.y,
         activeColor,
         width: shape.w,
         height: shape.h,
         isMassiveSelected: massiveSelected,
      });
   }

   if (shouldRestore) {
      context.restore();
   }
};

export default drawText;
