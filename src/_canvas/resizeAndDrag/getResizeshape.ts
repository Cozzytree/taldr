import { CanvasShape, ResizeDirection } from "../canvasTypes";
import { rectResizeParams } from "./resizeParams";

const getResizeShape = ({
   shape,
   mouseX,
   mouseY,
   tolerance,
}: {
   mouseX: number;
   mouseY: number;
   tolerance: number;
   shape: CanvasShape;
}) => {
   const props = shape.props;
   let conds: { condition: boolean; side: ResizeDirection }[];
   let isShape: { condition: boolean; side: ResizeDirection } | undefined;

   switch (shape.type) {
      case "line":
         if (props.points) {
            // props.points.forEach((p) => {
            //    if (mouseX)
            // })
         }
         break;
      case "ellipse":
         conds = rectResizeParams({
            x: props.x - (props.xRadius ?? 0),
            y: props.y - (props.yRadius ?? 0),
            width: (props.xRadius ?? 1) * 2,
            height: (props.yRadius ?? 1) * 2,
            mouseX,
            mouseY,
            tolerance,
         });
         isShape = conds.find((cond) => cond.condition);
         if (isShape) {
            return isShape.side;
         }
         break;
      default:
         conds = rectResizeParams({
            x: props.x,
            y: props.y,
            width: props.w,
            height: props.h,
            mouseX,
            mouseY,
            tolerance,
         });
         isShape = conds.find((cond) => cond.condition);
         if (isShape) {
            return isShape.side;
         }
         break;
   }

   return false;
};

export { getResizeShape };
