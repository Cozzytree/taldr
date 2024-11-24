import { CanvasShape } from "../canvasTypes";
import { isInside } from "../utils";

const lineConnection = ({
   point,
   allShapes,
}: {
   allShapes: CanvasShape[];
   point: { x: number; y: number };
}) => {
   let smallesShape: number | null = null;

   allShapes.forEach((p, i) => {
      if (!p) return;
      if (
         isInside({
            inner: { x: point.x, y: point.y, w: 0, h: 0 },
            outer: p.props,
         })
      ) {
         if (
            smallesShape == null ||
            allShapes[smallesShape].props.w < p.props.w
         ) {
            smallesShape = i;
         }
      }
   });

   return smallesShape;
};

const connectionOfShapes = ({
   shape,
   allShapes,
}: {
   shape: CanvasShape;
   allShapes: CanvasShape[];
}) => {
   allShapes.forEach((p) => {
      if (!p || p.type !== "line") return;

      if (p.props.startShape) {
         if (p.props.startShape.shapeId === shape.id) {
            p.props.startShape.followPoint = {
               x: (p.props.startShape.xPer / 100) * shape.props.w,
               y: (p.props.startShape.yPer / 100) * shape.props.y,
            };
         }
      }
      if (p.props.endShape) {
         if (p.props.endShape.shapeId === shape.id) {
            p.props.endShape.followPoint = {
               x: (p.props.endShape.xPer / 100) * shape.props.w,
               y: (p.props.endShape.yPer / 100) * shape.props.y,
            };
            console.log(p.props.endShape.followPoint);
         }
      }
   });
};

export { lineConnection, connectionOfShapes };
