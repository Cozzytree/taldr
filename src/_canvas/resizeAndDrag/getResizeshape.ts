import { cConf } from "../canvasConfig";
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

  cConf.activeShapes.delete(shape.id);

  switch (shape.type) {
    case "line":
      if (props.points) {
        for (let i = 0; i < props.points.length; i++) {
          const p = props.points[i];
          if (
            mouseX >= p.x - tolerance &&
            mouseX <= p.x + tolerance &&
            mouseY >= p.y - tolerance &&
            mouseY <= p.y + tolerance
          ) {
            if (i === 0) {
              return "top-edge";
            } else if (i === props.points.length - 1) {
              return "bottom-edge";
            }
          }
        }
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
