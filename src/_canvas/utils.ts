import { CanvasShape, ResizeDirection } from "./canvasTypes";
import { v4 as uuidv4 } from "uuid";

export const fontSizes = [
  { label: "S", size: 16, lineWidth: 4, weight: "lighter" },
  { label: "M", size: 18, lineWidth: 5, weight: "normal" },
  { label: "L", size: 20, lineWidth: 7, weight: "bold" },
  { label: "XL", size: 22, lineWidth: 8, weight: "bolder" },
];

export const colors = [
  "#F4A300", // Golden yellow
  "#D32F2F", // Red
  "#1976D2", // Blue
  "#388E3C", // Green
  "#8E24AA", // Purple
  "#2a00ff", // Sky blue
  "#FBC02D", // Yellow
  "#7B1FA2", // Violet
  "#4dff00", // Teal
  "#FF5722", // Orange
  "#FFFFFF", // White

  // Additional colors with gradients
  "#FFB6C1", // Light pink
  "#00FFFF", // Aqua
  "#800080", // Purple
  "#FFD700", // Gold
  "#C71585", // Medium violet red
  "#32CD32", // Lime green
  "#FF6347", // Tomato red
  "#FF1493", // Deep pink
  "#8A2BE2", // Blue violet
  "#A52A2A", // Brown
  "#F08080", // Light coral
  "#D3D3D3", // Light grey
  "#20B2AA", // Light sea green
  "#ADD8E6", // Light blue
  "#FF4500", // Orange red
  "#800000", // Maroon
  "#808000", // Olive
  "#0D98BA", // Dark cyan
  "#A9A9A9", // Dark grey
  "#FFC0CB", // Pink
  "#D2691E", // Chocolate
  "#F4A300", // Golden yellow (again for gradient effect)
  "#00BFFF", // Deep sky blue
];

const drawDotsAndRectActive = ({
  x,
  y,
  width,
  height,
  context,
  tolerance,
  activeColor,
  drawRect = true,
  isMassiveSelected,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  tolerance: number;
  drawRect?: boolean;
  activeColor: string;
  isMassiveSelected: boolean;
  context: CanvasRenderingContext2D;
}) => {
  // Draw dots
  if (isMassiveSelected) return;
  dots({
    sides: [
      { x: x - tolerance, y: y - tolerance },
      { x: x + width + tolerance, y: y - tolerance },
      { x: x + width + tolerance, y: y + height + tolerance },
      { x: x - tolerance, y: y + height + tolerance },
    ],
    activeColor,
    ctx: context,
  });

  if (drawRect) {
    // Draw active rectangle
    context.beginPath();
    context.strokeStyle = activeColor;
    context.lineWidth = 2;
    // context.setLineDash([5, 5]);
    context.rect(
      x - tolerance,
      y - tolerance,
      width + 2 * tolerance,
      height + 2 * tolerance,
    );
    context.stroke();
    context.closePath();
  }
};

const dots = ({
  ctx,
  sides,
  activeColor,
  shouldFill = false,
}: {
  activeColor: string;
  shouldFill?: boolean;
  sides: { x: number; y: number }[];
  ctx: CanvasRenderingContext2D;
}) => {
  for (let i = 0; i < sides.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1.7;
    ctx.strokeStyle = activeColor;
    ctx.fillStyle = activeColor;
    ctx.arc(sides[i].x, sides[i].y, 5, 0, 2 * Math.PI, false);
    if (shouldFill) ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
};

const adjustWithandHeightPoints = ({
  points,
}: {
  points: { x: number; y: number }[];
}) => {
  let x = Infinity; // initialize x and y as infinity
  let y = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  points.forEach((p) => {
    if (x > p.x) {
      x = p.x;
    }
    if (maxX < p.x) {
      maxX = p.x;
    }
    if (y > p.y) {
      y = p.y;
    }
    if (maxY < p.y) {
      maxY = p.y;
    }
  });
  return { x, y, width: maxX - x, height: maxY - y };
};

const reEvaluateShape = (shape: CanvasShape, allShapes: CanvasShape[]) => {
  if (!shape) return;
  switch (shape.type) {
    case "ellipse":
      shape.props.xRadius = Math.max(shape.props.xRadius ?? 0, 20);
      shape.props.yRadius = Math.max(shape.props.yRadius ?? 0, 20);
      shape.props.w = 2 * (shape.props.xRadius ?? 0);
      shape.props.h = 2 * (shape.props.yRadius ?? 0);
      break;
    case "line":
      if (shape.props.points) {
        const { width, height, x, y } = adjustWithandHeightPoints({
          points: shape.props.points,
        });
        shape.props.x = x;
        shape.props.y = y;
        shape.props.w = width;
        shape.props.h = height;
      }
      break;
    case "pencil":
      if (shape.props.points) {
        const { width, height, x, y } = adjustWithandHeightPoints({
          points: shape.props.points,
        });
        shape.props.x = x;
        shape.props.y = y;
        shape.props.w = width;
        shape.props.h = height;
      }
      break;
    case "figure":
      shape.props.w = Math.max(shape.props.w, 20);
      shape.props.h = Math.max(shape.props.h, 20);
      /* check inside figures */
      allShapes.forEach((s) => {
        if (!shape || s.id === shape.id) return;
        if (
          isInside({
            inner: {
              x: s.props.x,
              y: s.props.y,
              w: s.props.w,
              h: s.props.h,
            },
            outer: {
              x: shape.props.x,
              y: shape.props.y,
              w: shape.props.w,
              h: shape.props.h,
            },
          })
        ) {
          s.props.containerId = shape.id;
        } else if (s.props.containerId === shape.id) {
          s.props.containerId = undefined;
        }
      });

      break;
    case "others":
      if (shape.props.xRadius) {
        shape.props.w = shape.props.xRadius * 2;
        shape.props.h = shape.props.w;
      }
      break;
    default:
      shape.props.w = Math.max(shape.props.w, 20);
      shape.props.h = Math.max(shape.props.h, 20);

      allShapes.forEach((s, i) => {
        if (!s || s.type !== "line") return;
        if (s.props.startShape) {
          if (s.props.startShape.shapeId === shape.id) {
            reEvaluateShape(allShapes[i], allShapes);
          }
        }
        if (s.props.endShape) {
          if (s.props.endShape.shapeId === shape.id) {
            reEvaluateShape(allShapes[i], allShapes);
          }
        }
      });

      break;
  }
};

const isInside = ({
  inner,
  outer,
}: {
  inner: { x: number; y: number; w: number; h: number };
  outer: { x: number; y: number; w: number; h: number };
}) => {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  );
};

const getOffsets = ({
  shape,
  mouseX,
  mouseY,
}: {
  shape: CanvasShape;
  mouseX: number;
  mouseY: number;
}) => {
  switch (shape.type) {
    case "ellipse":
      shape.props.offsetX = mouseX - shape.props.x;
      shape.props.offsetY = mouseY - shape.props.y;
      break;
    case "line":
      shape.props.offsetX = mouseX - shape.props.x;
      shape.props.offsetY = mouseY - shape.props.y;
      shape.props.points?.forEach((p) => {
        p.offsetX = mouseX - p.x;
        p.offsetY = mouseY - p.y;
      });
      break;
    case "pencil":
      shape.props.offsetX = mouseX - shape.props.x;
      shape.props.offsetY = mouseY - shape.props.y;
      shape.props.points?.forEach((p) => {
        p.offsetX = mouseX - p.x;
        p.offsetY = mouseY - p.y;
      });
      break;
    default:
      shape.props.offsetX = mouseX - shape.props.x;
      shape.props.offsetY = mouseY - shape.props.y;
      break;
  }
};

const duplicateShape = ({
  shape,
  imageMap,
}: {
  shape: CanvasShape;
  imageMap?: Map<string, HTMLImageElement>;
}) => {
  if (!shape) return;
  const padding = 20;

  const newShape: CanvasShape = JSON.parse(JSON.stringify(shape));
  newShape.props.connectedTo = [];

  newShape.props.x = newShape.props.x + padding;
  newShape.props.y = newShape.props.y + padding;

  if (newShape.type === "line") {
    newShape.props.startShape = null;
    newShape.props.endShape = null;
  }

  /* adjust points */
  if (newShape.type === "pencil" || newShape.type === "line") {
    newShape.props.points?.forEach((p) => {
      p.x = p.x + padding;
      p.y = p.y + padding;
    });
  }

  newShape.id = uuidv4();
  if (newShape.type === "image" && newShape.props.image) {
    const i = new Image();
    i.src = newShape.props.image;
    if (imageMap) imageMap.set(newShape.id, i);
  }
  return newShape;
};

const getClosestPointOnSphere = ({
  sphere,
  point,
}: {
  sphere: { x: number; y: number; xRadius: number; yRadius: number };
  point: { x: number; y: number };
}) => {
  const dx = point.x - sphere.x;
  const dy = point.y - sphere.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const closestX = sphere.x + (dx / dist) * sphere.xRadius;
  const closestY = sphere.y + (dy / dist) * sphere.yRadius;
  return { x: closestX, y: closestY };
};

const getClosestPoints = ({
  rect,
  point,
}: {
  rect: { x: number; y: number; w: number; h: number };
  point: { x: number; y: number };
}) => {
  const closestX = Math.max(rect.x, Math.min(point.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(point.y, rect.y + rect.h));
  return { x: closestX, y: closestY };
};

const intersectLineWithBox = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
) => {
  const intersections = [];

  // Calculate direction of the line
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Check for intersection with the left vertical edge (x = xmin)
  if (dx !== 0) {
    const tLeft = (xmin - x1) / dx;
    if (tLeft >= 0 && tLeft <= 1) {
      const yIntersection = y1 + tLeft * dy;
      if (yIntersection >= ymin && yIntersection <= ymax) {
        intersections.push([xmin, yIntersection]);
      }
    }
  }

  // Check for intersection with the right vertical edge (x = xmax)
  if (dx !== 0) {
    const tRight = (xmax - x1) / dx;
    if (tRight >= 0 && tRight <= 1) {
      const yIntersection = y1 + tRight * dy;
      if (yIntersection >= ymin && yIntersection <= ymax) {
        intersections.push([xmax, yIntersection]);
      }
    }
  }

  // Check for intersection with the bottom horizontal edge (y = ymin)
  if (dy !== 0) {
    const tBottom = (ymin - y1) / dy;
    if (tBottom >= 0 && tBottom <= 1) {
      const xIntersection = x1 + tBottom * dx;
      if (xIntersection >= xmin && xIntersection <= xmax) {
        intersections.push([xIntersection, ymin]);
      }
    }
  }

  // Check for intersection with the top horizontal edge (y = ymax)
  if (dy !== 0) {
    const tTop = (ymax - y1) / dy;
    if (tTop >= 0 && tTop <= 1) {
      const xIntersection = x1 + tTop * dx;
      if (xIntersection >= xmin && xIntersection <= xmax) {
        intersections.push([xIntersection, ymax]);
      }
    }
  }

  return intersections;
};

const slope = ({
  mouseX,
  mouseY,
  points,
}: {
  mouseX: number;
  mouseY: number;
  points: { x: number; y: number }[];
}) => {
  const pa = points[0];
  const pb = points[1];

  // const lineSlope = pb.y - pa.y / pb.x - pa.x;

  // Calculate the slope between the mouse position and each point
  const slopeMouseA = (mouseY - pa.y) / (mouseX - pa.x);
  const slopeMouseB = (mouseY - pb.y) / (mouseX - pb.x);
  return Math.abs(slopeMouseA - slopeMouseB) <= 1;
};

const cursorHelper = ({ direction }: { direction: ResizeDirection }) => {
  switch (direction) {
    case "top-edge":
      document.body.style.cursor = "ns-resize"; // North-South resize cursor
      break;
    case "bottom-edge":
      document.body.style.cursor = "ns-resize"; // North-South resize cursor
      break;
    case "left-edge":
      document.body.style.cursor = "ew-resize"; // East-West resize cursor
      break;
    case "right-edge":
      document.body.style.cursor = "ew-resize"; // East-West resize cursor
      break;
    case "top-left":
      document.body.style.cursor = "nwse-resize"; // North-West South-East diagonal resize cursor
      break;
    case "bottom-left":
      document.body.style.cursor = "nesw-resize"; // North-East South-West diagonal resize cursor
      break;
    case "top-right":
      document.body.style.cursor = "nesw-resize"; // North-East South-West diagonal resize cursor
      break;
    case "bottom-right":
      document.body.style.cursor = "nwse-resize"; // North-West South-East diagonal resize cursor
      break;
  }
};

export {
  dots,
  slope,
  isInside,
  getOffsets,
  cursorHelper,
  duplicateShape,
  reEvaluateShape,
  getClosestPoints,
  intersectLineWithBox,
  drawDotsAndRectActive,
  getClosestPointOnSphere,
  adjustWithandHeightPoints,
};
