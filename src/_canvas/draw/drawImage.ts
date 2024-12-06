import { CanvasShape } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";

const drawImage = ({
   img,
   ctx,
   isActive,
   activeColor,
   imgElement,
   tolerance = 6,
   isMassiveSelected,
   shouldRestore = true,
}: {
   img: CanvasShape;
   isActive?: boolean;
   tolerance?: number;
   activeColor?: string;
   shouldRestore?: boolean;
   isMassiveSelected?: boolean;
   imgElement?: HTMLImageElement;
   ctx: CanvasRenderingContext2D;
}) => {
   const { image, x, y, w, h } = img.props;
   if (!image) return;

   if (imgElement) {
      ctx.drawImage(imgElement, x, y, w, h)
   } else {
      const i = new Image();
      i.src = image
      i.onload = () => {
         ctx.drawImage(i, x, y, w, h);
      }
   }

   if (isActive && activeColor) {
      drawDotsAndRectActive({
         x,
         y,
         width: w,
         height: h,
         tolerance,
         activeColor,
         context: ctx,
         isMassiveSelected: !!isMassiveSelected,
      });
   }

   if (shouldRestore) ctx.restore();
};

export { drawImage };
