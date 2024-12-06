import { CanvasShape } from "../canvasTypes";
import { drawDotsAndRectActive } from "../utils";

const drawImage = ({
   img,
   ctx,
   isActive,
   activeColor,
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
   ctx: CanvasRenderingContext2D;
}) => {
   const { image, x, y, w, h } = img.props;
   if (!image) return;

   ctx.drawImage(image, x, y, w, h);

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
