import DefaultShape from "./canvasConfig";
import { v4 as uuidv4 } from "uuid";
import { CanvasShape, ShapeProps, shapeType } from "./canvasTypes";
import { rectDraw } from "./draw/drawRect";
import { drawEllipse } from "./draw/drawEllipse";
import { drawLine } from "./draw/drawline";
import { adjustWithandHeightPoints } from "./utils";

const intializeShape = ({
   shapeType,
   initialPoint,
}: {
   shapeType: shapeType;
   initialPoint: { x: number; y: number };
}): CanvasShape | null => {
   let defaultStyle: ShapeProps;
   switch (shapeType) {
      case "rect":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
      case "ellipse":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         defaultStyle.xRadius = 0;
         defaultStyle.yRadius = 0;
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
      case "line":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         defaultStyle.arrowE = true;
         defaultStyle.points = [];
         defaultStyle.points.push({ x: initialPoint.x, y: initialPoint.y });
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
   }
   return null;
};

const buildingNewShape = ({
   ctx,
   shape,
   mouseX,
   mouseY,
}: {
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
   ctx: CanvasRenderingContext2D;
}) => {
   switch (shape.type) {
      case "rect":
         shape.props.w = mouseX - shape.props.x;
         shape.props.h = mouseY - shape.props.y;
         rectDraw({
            context: ctx,
            isActive: false,
            rect: shape.props,
            massiveSelected: false,
         });
         break;
      case "ellipse":
         shape.props.xRadius = Math.abs(mouseX - shape.props.x);
         shape.props.yRadius = Math.abs(mouseY - shape.props.y);
         drawEllipse({
            ctx,
            isActive: false,
            shape: shape.props,
         });
         break;
      case "line":
         drawLine({
            ctx,
            isActive: false,
            shape: shape.props,
            tempPoint: { x: mouseX, y: mouseY },
         });
         break;
   }
};

const buildShape = ({
   shape,
   mouseX,
   mouseY,
}: {
   shape: CanvasShape;
   mouseX: number;
   mouseY: number;
}) => {
   switch (shape.type) {
      case "rect":
         if (shape.props.x < mouseX) {
            shape.props.w = mouseX - shape.props.x;
         } else {
            shape.props.w = shape.props.x - mouseX;
            shape.props.x = mouseX;
         }

         if (shape.props.y < mouseY) {
            shape.props.h = mouseY - shape.props.y;
         } else {
            shape.props.h = shape.props.y - mouseY;
            shape.props.y = mouseY;
         }
         shape.props.w = Math.max(shape.props.w, 20);
         shape.props.h = Math.max(shape.props.h, 20);

         break;
      case "ellipse":
         shape.props.w = 2 * (shape.props.xRadius ?? 0);
         shape.props.h = 2 * (shape.props.yRadius ?? 0);
         break;
      case "line":
         if (shape.props.points) {
            shape.props.points.push({ x: mouseX, y: mouseY });
            const { x, y, width, height } = adjustWithandHeightPoints({
               points: shape.props.points,
            });
            shape.props.x = x;
            shape.props.y = y;
            shape.props.w = width;
            shape.props.h = height;
         }
         break;
   }
};

const createNewText = ({
   fSize,
   mouseX,
   mouseY,
   blurEvent,
}: {
   mouseX: number;
   mouseY: number;
   fSize: number;
   blurEvent: ({ text, w, h }: { text: string; w: number; h: number }) => void;
}) => {
   const el = document.createElement("div");
   el.style.position = "absolute";
   el.style.top = mouseY + "px";
   el.style.left = mouseX + "px";
   el.style.zIndex = "100";
   el.style.fontSize = fSize + "px";
   el.classList.add("border-none", "w-fit", "h-fit", "outline-none");
   el.setAttribute("contenteditable", "true");

   document.body.append(el);
   el.focus();

   el.addEventListener("blur", () => {
      blurEvent({ text: el.innerText, w: el.clientWidth, h: el.clientHeight });
      el.remove();
   });
};

export { intializeShape, buildingNewShape, buildShape, createNewText };
