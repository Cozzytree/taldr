import DefaultShape, { cConf } from "./canvasConfig";
import { v4 as uuidv4 } from "uuid";
import { CanvasShape, ShapeProps, shapeType } from "./canvasTypes";
import { rectDraw } from "./draw/drawRect";
import { drawEllipse } from "./draw/drawEllipse";
import { drawLine } from "./draw/drawline";
import { adjustWithandHeightPoints } from "./utils";
import { drawPencil } from "./draw/drawPencil";
import { drawImage } from "./draw/drawImage";

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
         defaultStyle.points.push({
            x: initialPoint.x,
            y: initialPoint.y,
            offsetX: 0,
            offsetY: 0,
         });
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
      case "pencil":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         defaultStyle.points = [];
         defaultStyle.points.push({
            x: initialPoint.x,
            y: initialPoint.y,
            offsetX: 0,
            offsetY: 0,
         });
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
      case "figure":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         defaultStyle.name = "Frame";
         return {
            id: uuidv4(),
            props: defaultStyle as ShapeProps,
            type: shapeType,
         };
      case "image":
         defaultStyle = new DefaultShape({
            x: initialPoint.x,
            y: initialPoint.y,
         });
         return {
            id: uuidv4(),
            props: { ...defaultStyle, image: cConf.image } as ShapeProps,
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
      case "pencil":
         shape.props.points?.push({
            x: mouseX,
            y: mouseY,
            offsetX: 0,
            offsetY: 0,
         });
         drawPencil({ ctx, shape: shape.props });
         break;
      case "figure":
         shape.props.w = mouseX - shape.props.x;
         shape.props.h = mouseY - shape.props.y;
         rectDraw({
            context: ctx,
            isActive: false,
            rect: shape.props,
            massiveSelected: false,
         });
         break;
      case "image":
         shape.props.w = mouseX - shape.props.x;
         shape.props.h = mouseY - shape.props.y;
         if (!shape.props.image) return;
         drawImage({ ctx, isActive: false, img: shape });
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
            shape.props.points.push({
               x: mouseX,
               y: mouseY,
               offsetX: 0,
               offsetY: 0,
            });
            const { x, y, width, height } = adjustWithandHeightPoints({
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
            const { x, y, width, height } = adjustWithandHeightPoints({
               points: shape.props.points,
            });
            shape.props.x = x;
            shape.props.y = y;
            shape.props.w = width;
            shape.props.h = height;
         }
         break;
      case "figure":
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
      case "image":
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
   }
};

const createNewText = ({
   fSize,
   mouseX,
   mouseY,
   width,
   height,
   text,
   blurEvent,
}: {
   text?: string;
   fSize: number;
   width?: number;
   height?: number;
   mouseX: number;
   mouseY: number;
   blurEvent: ({ text, w, h }: { text: string; w: number; h: number }) => void;
}) => {
   const el = document.createElement("div");
   el.style.position = "absolute";
   el.style.top = (mouseY - cConf.offset.y) / cConf.scale.y + "px";
   el.style.left = (mouseX - cConf.offset.x) / cConf.scale.x + "px";
   el.style.minWidth = width ? width + "px" : "10px";
   el.style.minHeight = height ? height + "px" : "10px";
   el.style.zIndex = "100";
   el.style.fontSize = fSize + "px";
   el.classList.add(
      "border-none",
      "outline-none",
      "bg-background",
      "p-2",
      "flex",
      "justify-center",
      "items-center",
      "text-center",
      "overflow-y-auto",
   );
   el.setAttribute("contenteditable", "true");

   document.body.append(el);
   el.innerText = text || "";
   el.focus();

   el.addEventListener("blur", () => {
      blurEvent({ text: el.innerText, w: el.clientWidth, h: el.clientHeight });
      el.remove();
   });
};

export { intializeShape, buildingNewShape, buildShape, createNewText };
