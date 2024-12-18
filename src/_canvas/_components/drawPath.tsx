import {CanvasShape} from "@/_canvas/canvasTypes.ts";
import {drawDotsAndRectActive} from "@/_canvas/utils.ts";

const drawPath = ({
  ctx,
  shape,
  isActive,
  activeColor,
  tolerance = 6,
  isMassiveSelected,
  shouldRestore = true
} : {
   isActive? :boolean,
   tolerance? : number,
   shape : CanvasShape,
   activeColor : string,
   shouldRestore? : boolean,
   isMassiveSelected? : boolean,
   ctx: CanvasRenderingContext2D,
}) => {
   const {xRadius, x, y, iteration, stroke, fill, lineWidth, w, h, inset } = shape.props

   if (!iteration) return;
   ctx.save()
   ctx.beginPath()
   ctx.strokeStyle = stroke;
   ctx.lineWidth = lineWidth;
   ctx.fillStyle = fill;

   ctx.translate(x + w * 0.5, y + h * 0.5);
   ctx.moveTo(0, 0 - (xRadius ?? 0));
   for (let i = 0; i < iteration; i++) {
      ctx.rotate(Math.PI / iteration);
      ctx.lineTo(0, 0 - (xRadius ?? 0) * (inset ?? 0));
      ctx.rotate(Math.PI / iteration);
      ctx.lineTo(0, 0 - ( xRadius ?? 0));
   }

   ctx.fill()
   ctx.stroke()
   ctx.closePath()
   ctx.restore()

   if (isActive) {
      drawDotsAndRectActive({
         x,
         y,
         tolerance,
         height : h,
         width : w,
         activeColor,
         context : ctx,
         isMassiveSelected : !!isMassiveSelected
      })
   }

   if (shouldRestore) {
      ctx.restore()
   }
}

export default drawPath;