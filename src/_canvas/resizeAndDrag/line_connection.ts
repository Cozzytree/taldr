import { CanvasShape } from "../canvasTypes";
import { intersectLineWithBox, isInside } from "../utils";

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

const findConnectionAndMove = ({
   shape,
   allShapes,
}: {
   shape: CanvasShape;
   allShapes: CanvasShape[];
}) => {
   allShapes.forEach((s) => {
      if (!s || s.type !== "line" || !s.props.points) return;
      if (s.props.startShape) {
         if (s.props.startShape.shapeId === shape.id) {
            s.props.startShape.followPoint = {
               x:
                  shape.props.x +
                  (s.props.startShape.xPer / 100) * shape.props.w,
               y:
                  shape.props.y +
                  (s.props.startShape.yPer / 100) * shape.props.h,
            };

            const po = intersectLineWithBox(
               s.props.points[s.props.points.length - 1].x,
               s.props.points[s.props.points.length - 1].y,
               s.props.startShape.followPoint.x,
               s.props.startShape.followPoint.y,
               shape.props.x,
               shape.props.x + shape.props.w,
               shape.props.y,
               shape.props.y + shape.props.h,
            );
            if (po.length) {
               s.props.points[0].x = po[0][0];
               s.props.points[0].y = po[0][1];
            }

            /* check if this line end is connected */
            if (s.props.endShape) {
               const endShape = findConnectionOpposite({
                  allShapes,
                  conId: s.props.endShape.shapeId,
               });

               if (endShape) {
                  s.props.endShape.followPoint = {
                     x:
                        endShape.props.x +
                        (s.props.endShape.xPer / 100) * endShape.props.w,
                     y:
                        endShape.props.y +
                        (s.props.endShape.yPer / 100) * endShape.props.h,
                  };

                  const p = intersectLineWithBox(
                     s.props.points[0].x,
                     s.props.points[0].y,
                     s.props.endShape.followPoint.x,
                     s.props.endShape.followPoint.y,
                     endShape.props.x,
                     endShape.props.x + endShape.props.w,
                     endShape.props.y,
                     endShape.props.y + endShape.props.h,
                  );
                  if (p.length) {
                     s.props.points[1].x = p[0][0];
                     s.props.points[1].y = p[0][1];
                  }
               }
            }
         }
      }

      if (s.props.endShape) {
         if (s.props.endShape.shapeId === shape.id) {
            s.props.endShape.followPoint = {
               x: shape.props.x + (s.props.endShape.xPer / 100) * shape.props.w,
               y: shape.props.y + (s.props.endShape.yPer / 100) * shape.props.h,
            };

            const po = intersectLineWithBox(
               s.props.points[0].x,
               s.props.points[0].y,
               s.props.endShape.followPoint.x,
               s.props.endShape.followPoint.y,
               shape.props.x,
               shape.props.x + shape.props.w,
               shape.props.y,
               shape.props.y + shape.props.h,
            );
            if (po.length) {
               s.props.points[1].x = po[0][0];
               s.props.points[1].y = po[0][1];
            }

            /* check if this line start is connected */
            if (s.props.startShape) {
               const startShape = findConnectionOpposite({
                  allShapes,
                  conId: s.props.startShape.shapeId,
               });

               if (startShape) {
                  s.props.startShape.followPoint = {
                     x:
                        startShape.props.x +
                        (s.props.startShape.xPer / 100) * startShape.props.w,
                     y:
                        startShape.props.y +
                        (s.props.startShape.yPer / 100) * startShape.props.h,
                  };

                  const p = intersectLineWithBox(
                     s.props.points[s.props.points.length - 1].x,
                     s.props.points[s.props.points.length - 1].y,
                     s.props.startShape.followPoint.x,
                     s.props.startShape.followPoint.y,
                     startShape.props.x,
                     startShape.props.x + startShape.props.w,
                     startShape.props.y,
                     startShape.props.y + startShape.props.h,
                  );
                  if (p.length) {
                     s.props.points[0].x = p[0][0];
                     s.props.points[0].y = p[0][1];
                  }
               }
            }
         }
      }
   });
};

const findConnectionOpposite = ({
   conId,
   allShapes,
}: {
   conId: string;
   allShapes: CanvasShape[];
}) => {
   for (let i = 0; i < allShapes.length; i++) {
      if (!allShapes[i] || allShapes[i].type === "line") continue;
      if (conId === allShapes[i].id) {
         return allShapes[i];
      }
   }
};

export { lineConnection, connectionOfShapes, findConnectionAndMove };
