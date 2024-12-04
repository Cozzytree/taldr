import {CanvasShape} from "@/_canvas/canvasTypes.ts";
import {drawDotsAndRectActive} from "@/_canvas/utils.ts";
import {drawTextInsideShape} from "@/_canvas/draw/drawText.ts";

const drawTriangle = (
   {
      ctx,
      shape,
      isActive,
      activeColor,
      tolerance = 6,
      isMassiveSelected,
      shouldRestore = true,
   } :
   {
      tolerance?: number,
      isActive? : boolean,
      shape : CanvasShape,
      activeColor : string,
      shouldRestore? : boolean,
      isMassiveSelected? : boolean,
      ctx : CanvasRenderingContext2D,
   }
) => {
   const { x, y, w, h, stroke, lineWidth, radius} = shape.props;

   ctx.beginPath()
   ctx.strokeStyle = stroke;
   ctx.lineWidth = lineWidth;

   let updatedRadius = radius;
   if (w <= 20 || h <= 20) {
      updatedRadius = 0;
   } else {
      updatedRadius = radius;
   }

   // Define the coordinates of the triangle's vertices
   const x1 = x + w * 0.5; // Top vertex (middle of the top edge)
   const y1 = y;
   const x2 = x + w;        // Bottom right vertex
   const y2 = y + h;
   const x3 = x;            // Bottom left vertex
   const y3 = y + h;

   ctx.moveTo(x1, y1)

   ctx.arcTo(x1, y1, x2, y2, updatedRadius)
   ctx.arcTo(x2, y2, x3, y3, updatedRadius)

   ctx.arcTo(x3, y3, x1, y1, updatedRadius)
   ctx.lineTo(x1, y1)

   ctx.stroke()
   ctx.closePath()

   drawTextInsideShape({shape : shape.props, context : ctx})

   if (isActive) {
      drawDotsAndRectActive({
         x,
         y,
         width: w,
         height: h,
         tolerance,
         activeColor ,
         context : ctx,
         isMassiveSelected : !!isMassiveSelected
      })
   }

   if (shouldRestore) {
      ctx.restore();
   }
}

export {drawTriangle}