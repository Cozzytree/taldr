import { CanvasShape } from "../canvasTypes";
import { isInside, slope } from "../utils";

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
      case "line":
         if (!shape.props.points) return;
         if (
            mouseX > shape.props.x &&
            mouseX < shape.props.x + shape.props.w &&
            mouseY > shape.props.y &&
            mouseY < shape.props.y + shape.props.h &&
            slope({ mouseX, mouseY, points: shape.props.points })
         ) {
            return true;
         }
         break;
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
