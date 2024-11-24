import { CanvasShape } from "../canvasTypes";
import { connectionOfShapes } from "./line_connection";

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
         break;
      default:
         shape.props.x = mouseX - shape.props.offsetX;
         shape.props.y = mouseY - shape.props.offsetY;

         /* for resize */
         // if (shape.props.connectedTo.length) {
         //    connectionOfShapes({ allShapes, shape });
         // }
         break;
   }
};

export { dragMove };
