import { cConf } from "./canvasConfig";
import { CanvasShape } from "./canvasTypes";
import { drawDotsAndRectActive, isInside } from "./utils";

const checkShapeInsideSelection = ({
  selection,
  allShapes,
}: {
  allShapes: CanvasShape[];
  selection: { x: number; y: number; h: number; w: number };
}) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  allShapes.forEach((s) => {
    if (!s) return;
    if (
      isInside({
        inner: { x: s.props.x, y: s.props.y, w: s.props.w, h: s.props.h },
        outer: {
          x: selection.x,
          y: selection.y,
          w: selection.w,
          h: selection.h,
        },
      })
    ) {
      if (minX > s.props.x) {
        minX = s.props.x;
      }
      if (maxX < s.props.x + s.props.w) {
        maxX = s.props.x + s.props.w;
      }
      if (minY > s.props.y) {
        minY = s.props.y;
      }
      if (maxY < s.props.y + s.props.h) {
        maxY = s.props.y + s.props.h;
      }

      cConf.activeShapes.set(s.id, true);
    } else {
      cConf.activeShapes.delete(s.id);
    }
  });
  if (
    minX === Infinity ||
    minY === Infinity ||
    maxX === -Infinity ||
    maxY === -Infinity
  ) {
    return { x: 0, y: 0, w: 0, h: 0 }; // No shapes selected or no valid bounding box
  }

  return { x: minX, y: minY, h: maxY - minY, w: maxX - minX };
};

const selectonDrawRect = ({
  ctx,
  params,
  activeColor,
}: {
  activeColor: string;
  ctx: CanvasRenderingContext2D;
  params: { x: number; y: number; w: number; h: number };
}) => {
  ctx.beginPath();
  ctx.setLineDash([0, 0]);

  ctx.fillStyle = "#20202050";
  ctx.rect(params.x, params.y, params.w, params.h);
  ctx.fill();
  ctx.closePath();

  drawDotsAndRectActive({
    activeColor: activeColor,
    context: ctx,
    height: params.h,
    width: params.w,
    isMassiveSelected: false,
    tolerance: 0,
    x: params.x,
    y: params.y,
  });

  ctx.restore();
};

export { checkShapeInsideSelection, selectonDrawRect };
