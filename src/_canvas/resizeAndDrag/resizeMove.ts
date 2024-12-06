import { CanvasShape, ResizeDirection } from "../canvasTypes";
import { intersectLineWithBox } from "../utils";
import { findConnectionAndMove, lineConnection } from "./line_connection";
import { lineResize } from "./pointResizeParams";

const rectResizemove = ({
   mouseX,
   mouseY,
   shape,
   direction,
   resizeShape,
}: {
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
   resizeShape: CanvasShape;
   direction: ResizeDirection;
}) => {
   const { x, y, w, h } = resizeShape.props;

   if (direction === "left-edge") {
      if (mouseX < x + w) {
         shape.props.x = mouseX;
         shape.props.w = x + w - mouseX;
      } else if (mouseX > x + w) {
         shape.props.x = x + w;
         shape.props.w = mouseX - (x + w);
      }
   } else if (direction === "right-edge") {
      if (mouseX > x) {
         shape.props.w = mouseX - x;
      } else if (mouseX < x) {
         shape.props.x = mouseX;
         shape.props.w = x - mouseX;
      }
   } else if (direction === "top-edge") {
      if (mouseY < y + h) {
         shape.props.y = mouseY;
         shape.props.h = y + h - mouseY;
      } else if (mouseY > y + h) {
         shape.props.y = y + h;
         shape.props.h = mouseY - (y + h);
      }
   } else if (direction === "bottom-edge") {
      if (mouseY > y) {
         shape.props.h = mouseY - y;
      } else if (mouseY < y) {
         shape.props.y = mouseY;
         shape.props.h = y - mouseY;
      }
   } else {
      switch (direction) {
         case "top-left":
            shape.props.x = Math.min(mouseX, x + w);
            shape.props.y = Math.min(mouseY, y + h);
            shape.props.w = Math.abs(x + w - mouseX);
            shape.props.h = Math.abs(y + h - mouseY);
            break;

         case "top-right":
            if (mouseX > x) {
               shape.props.w = mouseX - x;
            } else if (mouseX < x) {
               shape.props.x = mouseX;
               shape.props.w = x - mouseX;
            }
            if (mouseY < y + h) {
               shape.props.y = mouseY;
               shape.props.h = y + h - mouseY;
            } else if (mouseY > h + y) {
               shape.props.y = y + h;
               shape.props.h = mouseY - shape.props.y;
            }

            break;

         case "bottom-left":
            if (mouseX < x + w) {
               shape.props.x = mouseX;
               shape.props.w = x + w - mouseX;
            } else if (mouseX > x + w) {
               shape.props.x = x + w;
               shape.props.w = mouseX - shape.props.x;
            }

            if (mouseY > y) {
               shape.props.h = mouseY - y;
            } else if (mouseY < y) {
               shape.props.h = y - mouseY;
               shape.props.y = mouseY;
            }

            break;

         case "bottom-right":
            if (mouseX > x) shape.props.w = mouseX - shape.props.x;
            else if (mouseX < x) {
               shape.props.x = mouseX;
               shape.props.w = x - mouseX;
            }
            if (mouseY > y) shape.props.h = mouseY - shape.props.y;
            else if (mouseY < y) {
               shape.props.y = mouseY;
               shape.props.h = y - mouseY;
            }

            break;

         default:
            break;
      }
   }
};

const ellipseResize = ({
   shape,
   mouseX,
   mouseY,
   direction,
}: {
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
   direction: ResizeDirection;
}) => {
   if (direction === "left-edge" || direction === "right-edge") {
      shape.props.xRadius = Math.abs(mouseX - shape.props.x);
   } else if (direction === "top-edge" || direction === "bottom-edge") {
      shape.props.yRadius = Math.abs(mouseY - shape.props.y);
   } else {
      shape.props.xRadius = Math.abs(mouseX - shape.props.x);
      shape.props.yRadius = Math.abs(mouseY - shape.props.y);
   }

   shape.props.w = 2 * (shape.props.xRadius ?? 0);
   shape.props.h = 2 * (shape.props.yRadius ?? 0);
};

const resizeMove = ({
   shape,
   mouseX,
   shapes,
   mouseY,
   direction,
   resizeShape,
}: {
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
   shapes: CanvasShape[];
   resizeShape: CanvasShape;
   direction: ResizeDirection | false;
}) => {
   if (!shape) return;
   switch (shape.type) {
      case "line":
         if (!shape.props.points) return false;
         if (direction === "top-edge") {
            /* connect line */
            const p = lineConnection({
               allShapes: shapes,
               point: { x: mouseX, y: mouseY },
            });

            if (
               p !== null &&
               shapes[p].id !== shape.id &&
               shapes[p].type !== "line"
            ) {
               /* intersection points */
               const i = intersectLineWithBox(
                  shape.props.points[shape.props.points.length - 1].x,
                  shape.props.points[shape.props.points.length - 1].y,
                  mouseX,
                  mouseY,
                  shapes[p].props.x,
                  shapes[p].props.x + shapes[p].props.w,
                  shapes[p].props.y,
                  shapes[p].props.y + shapes[p].props.h,
               );

               if (i.length) {
                  shape.props.points[0] = {
                     x: i[0][0],
                     y: i[0][1],
                     offsetX: 0,
                     offsetY: 0,
                  };
               }
            } else {
               shape.props.points[0] = {
                  x: mouseX,
                  y: mouseY,
                  offsetX: 0,
                  offsetY: 0,
               };
            }
         } else if (direction === "bottom-edge") {
            /* connect line */
            const p = lineConnection({
               allShapes: shapes,
               point: { x: mouseX, y: mouseY },
            });

            if (
               p !== null &&
               shapes[p].id !== shape.id &&
               shapes[p].type !== "line"
            ) {
               /* intersection points */
               const i = intersectLineWithBox(
                  shape.props.points[0].x,
                  shape.props.points[0].y,
                  mouseX,
                  mouseY,
                  shapes[p].props.x,
                  shapes[p].props.x + shapes[p].props.w,
                  shapes[p].props.y,
                  shapes[p].props.y + shapes[p].props.h,
               );

               if (i.length) {
                  shape.props.points[shape.props.points.length - 1] = {
                     x: i[0][0],
                     y: i[0][1],
                     offsetX: 0,
                     offsetY: 0,
                  };
               }
            } else {
               shape.props.points[shape.props.points.length - 1] = {
                  x: mouseX,
                  y: mouseY,
                  offsetX: 0,
                  offsetY: 0,
               };
            }
         }
         break;
      case "rect":
         if (direction) {
            rectResizemove({ direction, mouseX, mouseY, resizeShape, shape });
            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
      case "ellipse":
         if (direction) {
            ellipseResize({ direction, mouseX, mouseY, shape });
            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
      case "text":
         if (mouseX > resizeShape.props.x && mouseY > resizeShape.props.y) {
            shape.props.w = mouseX - shape.props.x;
            shape.props.fontSize =
               Math.max(
                  12, // Minimum size to prevent text from becoming too small
                  (mouseX - shape.props.x) * 0.2 +
                     (mouseY - shape.props.y) * 0.3,
               ) * 0.5;

            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
      case "pencil":
         if (direction)
            lineResize({
               shape,
               mouseX,
               mouseY,
               direction,
               r_e: resizeShape,
            });
         break;
      case "figure":
         if (direction) {
            rectResizemove({ direction, mouseX, mouseY, resizeShape, shape });
            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
      case "triangle":
         if (direction) {
            rectResizemove({ direction, mouseX, mouseY, resizeShape, shape });
            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
      case "others":
         shape.props.xRadius =
            mouseX > resizeShape.props.x + (resizeShape.props.xRadius ?? 0)
               ? mouseX -
                 (resizeShape.props.x + (resizeShape.props.xRadius ?? 0))
               : resizeShape.props.x +
                 (resizeShape.props.xRadius ?? 0) -
                 mouseX;
         findConnectionAndMove({ allShapes: shapes, shape });
         // shape.props.x = (resizeShape.props.x + resizeShape.props.w + 0.5) - shape.props.xRadius;
         // shape.props.y = (resizeShape.props.y + resizeShape.props.w + 0.5) - shape.props.xRadius;
         break;
      case "image":
         if (direction) {
            rectResizemove({ direction, mouseX, mouseY, resizeShape, shape });
            findConnectionAndMove({ allShapes: shapes, shape });
         }
         break;
         break;
   }
};

export { resizeMove };
