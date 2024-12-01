import { ShapeProps } from "../canvasTypes";
import { dots } from "../utils";

const drawText = ({
   shape,
   context,
   isActive,
   activeColor,
   tolerance = 6,
   shouldRestore = true,
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
   context.fillStyle = shape.fontColor;
   const texts = shape.text.split("\n");
   context.textAlign = shape.textAlign;
   context.font = `${shape.fontSize}px Arial`;

   // const maxHeight = texts.length * shape.fontSize;
   // Adjust horizontal positioning based on text alignment
   let xPoint;
   if (shape.textAlign === "center") {
      xPoint = shape.x + shape.w / 2;
   } else if (shape.textAlign === "left") {
      xPoint = shape.x + 10; // Adding small padding for left alignment
   } else {
      xPoint = shape.x + shape.w - 10; // Right alignment with small padding
   }
   let maxHeight = shape.y + shape.fontSize;

   texts.forEach((text) => {
      if (text === "") return;
      context.fillText(text, xPoint, maxHeight, shape.w);
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
   context.fillStyle = shape.fontColor;
   context.textAlign = shape.textAlign;

   const lineHeight = shape.fontSize; // You can adjust this value for line spacing

   const wrappedText: string[] = [];

   // Iterate over each line
   chunks.forEach((chunk) => {
      const words = chunk.split(" ");
      let currentLine = "";

      // Iterate over each word in the line
      words.forEach((word) => {
         const testLine = currentLine ? currentLine + " " + word : word;
         const testWidth = context.measureText(testLine).width;

         if (testWidth < shape.w) {
            // If the line fits, add the word to the current line
            currentLine = testLine;
         } else {
            // If the line exceeds the width, push the current line to the wrappedText and start a new line
            wrappedText.push(currentLine);
            currentLine = word;
         }
      });

      // After processing all words, push the last line
      if (currentLine) {
         wrappedText.push(currentLine);
      }
   });

   // Calculate vertical centering of the wrapped text
   let yPoint =
      shape.y +
      (shape.h - wrappedText.length * lineHeight) * 0.5 +
      shape.fontSize * 0.8;

   wrappedText.forEach((line) => {
      let xPoint = shape.x;

      // Adjust horizontal positioning based on text alignment
      if (shape.textAlign === "center") {
         xPoint = shape.x + shape.w / 2;
      } else if (shape.textAlign === "left") {
         xPoint = shape.x + 10; // Adding small padding for left alignment
      } else {
         xPoint = shape.x + shape.w - 10; // Right alignment with small padding
      }

      // Draw the line of text
      context.fillText(line, xPoint, yPoint);
      yPoint += lineHeight; // Move down by the line height for the next line
   });

   context.fill();
   context.closePath();
};

export default drawText;
