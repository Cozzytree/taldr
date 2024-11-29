import { cConf } from "../canvasConfig";
import { CanvasShape } from "../canvasTypes";
import { findConnectionAndMove } from "./line_connection";

const dragMove = ({
  shape,
  mouseX,
  mouseY,
  allShapes,
}: {
  mouseX: number;
  mouseY: number;
  shape: CanvasShape;
  allShapes: CanvasShape[];
}) => {
  if (!shape) return;
  switch (shape.type) {
    case "ellipse":
      shape.props.x = mouseX - shape.props.offsetX;
      shape.props.y = mouseY - shape.props.offsetY;
      findConnectionAndMove({ allShapes, shape });
      break;
    case "line":
      shape.props.points?.forEach((p) => {
        p.x = mouseX - p.offsetX;
        p.y = mouseY - p.offsetY;
      });
      shape.props.x = mouseX - shape.props.offsetX;
      shape.props.y = mouseY - shape.props.offsetY;

      break;
    case "pencil":
      shape.props.points?.forEach((p) => {
        p.x = mouseX - p.offsetX;
        p.y = mouseY - p.offsetY;
      });
      shape.props.x = mouseX - shape.props.offsetX;
      shape.props.y = mouseY - shape.props.offsetY;

      findConnectionAndMove({ allShapes, shape });

      break;
    case "figure":
      if (!cConf.activeShapes.has(shape.id)) {
        shape.props.x = mouseX - shape.props.offsetX;
        shape.props.y = mouseY - shape.props.offsetY;

        findConnectionAndMove({ allShapes, shape });
        allShapes.forEach((s) => {
          if (!s) return;
          if (s.props.containerId === shape.id) {
            dragMove({ mouseX, mouseY, allShapes, shape: s });
          }
        });
      }
      break;
    default:
      shape.props.x = mouseX - shape.props.offsetX;
      shape.props.y = mouseY - shape.props.offsetY;

      findConnectionAndMove({ allShapes, shape });

      break;
  }
};

export { dragMove };
