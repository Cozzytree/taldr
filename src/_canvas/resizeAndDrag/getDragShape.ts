import { CanvasShape } from "../canvasTypes";
import { isInside } from "../utils";

const getDragShape = ({
   shape,
   mouseX,
   mouseY,
}: {
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
}) => {
   switch (shape.type) {
      case "ellipse":
         if (
            isInside({
               inner: { x: mouseX, y: mouseY, w: 0, h: 0 },
               outer: {
                  x: shape.props.x - (shape.props.xRadius ?? 0),
                  y: shape.props.y - (shape.props.yRadius ?? 0),
                  w: shape.props.w,
                  h: shape.props.h,
               },
            })
         ) {
            return true;
         }
         break;
      default:
         if (
            isInside({
               inner: { x: mouseX, y: mouseY, w: 0, h: 0 },
               outer: {
                  x: shape.props.x,
                  y: shape.props.y,
                  w: shape.props.w,
                  h: shape.props.h,
               },
            })
         ) {
            return true;
         }
         break;
   }
   return false;
};

export { getDragShape };
