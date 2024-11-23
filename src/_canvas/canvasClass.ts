import { v4 as uuidv4 } from "uuid";
import DefaultShape, { cConf } from "./canvasConfig";
import { CanvasShape, modes, ResizeDirection, shapeType } from "./canvasTypes";
import { drawEllipse } from "./draw/drawEllipse";
import { drawLine } from "./draw/drawline";
import { rectDraw } from "./draw/drawRect";
import drawText from "./draw/drawText";
import {
   buildingNewShape,
   buildShape,
   createNewText,
   intializeShape,
} from "./newShape";
import { getResizeShape } from "./resizeAndDrag/getResizeshape";
import { resizeMove } from "./resizeAndDrag/resizeMove";
import { reEvaluateShape } from "./utils";

interface onChangeProps {
   shapes: CanvasShape[];
   currentMode: modes;
   activeShapes: number[];
}

interface contructProps {
   canvas: HTMLCanvasElement;
   fallbackCanvas: HTMLCanvasElement;
   onChange: ({ shapes, currentMode, activeShapes }: onChangeProps) => void;
   afterNewShape: ({
      mode,
      shape,
   }: {
      mode: modes;
      shape: CanvasShape;
   }) => void;
}

class CanvasClass {
   canvasShapes: CanvasShape[] = [];
   newShapeParams: null | CanvasShape = null;
   shapeGuides = Map<string, { x: number; y: number }>;
   activeColor = "#20ff20";
   tolerance = 5;
   dragShape: number | undefined = undefined;
   resizeShape:
      | {
           index: number;
           shape: CanvasShape;
           direction: ResizeDirection | false;
        }
      | undefined = undefined;

   multipleSelection = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
      isSelected: false,
   };

   canvas: HTMLCanvasElement;
   fallbackCanvas: HTMLCanvasElement;
   ctx: CanvasRenderingContext2D;
   fallbackContext: CanvasRenderingContext2D;
   onChange: ({ shapes, currentMode, activeShapes }: onChangeProps) => void;
   afterNewShape: ({
      mode,
      shape,
   }: {
      mode: modes;
      shape: CanvasShape;
   }) => void;

   constructor({
      canvas,
      fallbackCanvas,
      onChange,
      afterNewShape,
   }: contructProps) {
      this.canvas = canvas;
      this.fallbackCanvas = fallbackCanvas;

      const context = this.canvas.getContext("2d");
      if (!context) throw new Error("canvas not supported");

      const fallbackContext = this.fallbackCanvas.getContext("2d");
      if (!fallbackContext) throw new Error("canvas not supported");

      this.ctx = context;
      this.fallbackContext = fallbackContext;
      this.onChange = onChange;
      this.afterNewShape = afterNewShape;
   }

   clearRect(c: CanvasRenderingContext2D, h: number, w: number) {
      c.clearRect(0, 0, w, h);

      // Clear the canvas
      c.clearRect(0, 0, this.canvas.width, this.canvas.height);

      c.save();
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      c.translate(-cConf.offset.x, -cConf.offset.y);

      // Translate to the center
      c.translate(centerX, centerY);
      // Apply scaling
      c.scale(cConf.scale.x, cConf.scale.y);
      // Translate back from the center
      c.translate(-centerX, -centerY);
      // Enable anti-aliasing
      c.imageSmoothingEnabled = true;
   }

   draw() {
      this.clearRect(this.ctx, window.innerHeight, window.innerWidth);

      this.canvasShapes.forEach((shape) => {
         const isActive = cConf.activeShapes.has(shape.id);
         switch (shape.type) {
            case "rect":
               rectDraw({
                  isActive,
                  context: this.ctx,
                  rect: shape.props,
                  shouldRestore: false,
                  tolerance: this.tolerance,
                  activeColor: this.activeColor,
                  massiveSelected: this.multipleSelection.isSelected,
               });
               break;
            case "text":
               drawText({
                  isActive,
                  context: this.ctx,
                  shape: shape.props,
                  shouldRestore: false,
                  tolerance: this.tolerance,
                  activeColor: this.activeColor,
                  massiveSelected: this.multipleSelection.isSelected,
               });
               break;
            case "ellipse":
               drawEllipse({
                  isActive,
                  ctx: this.ctx,
                  shape: shape.props,
                  shouldRestore: false,
                  tolerance: this.tolerance,
                  activeColor: this.activeColor,
                  massiveSelected: this.multipleSelection.isSelected,
               });
               break;
            case "line":
               drawLine({
                  isActive,
                  ctx: this.ctx,
                  shape: shape.props,
                  shouldRestore: false,
                  tolerance: this.tolerance,
                  activeColor: this.activeColor,
                  massiveSelected: this.multipleSelection.isSelected,
               });
               break;
         }
      });

      this.ctx.restore();
   }

   mouse_Down(e: MouseEvent) {
      const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
      cConf.activeShapes.clear(); /* clear actives */
      console.log(cConf.activeShapes);

      if (cConf.currMode !== "pointer") {
         this.newShapeParams = intializeShape({
            initialPoint: { x: mouseX, y: mouseY },
            shapeType: cConf.currMode as shapeType,
         }) as CanvasShape;

         return;
      }

      let isResizeorDrag = false;
      for (let index = 0; index < this.canvasShapes.length; index++) {
         if (
            !this.canvasShapes[index]
            // || !cConf.activeShapes.has(this.canvasShapes[index].id)
         )
            continue;

         const shape = JSON.parse(JSON.stringify(this.canvasShapes[index]));
         const direction = getResizeShape({
            mouseX,
            mouseY,
            shape,
            tolerance: this.tolerance,
         });
         if (direction) {
            this.resizeShape = { index: index, shape: shape, direction };
            cConf.activeShapes.add(shape.id); /* add to actives */
            isResizeorDrag = true;
            break;
         }
      }

      if (isResizeorDrag) {
         this.draw();
         return;
      }

      this.draw();
   }

   mouse_Move(e: MouseEvent) {
      const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

      if (this.newShapeParams) {
         this.clearRect(
            this.fallbackContext,
            window.innerHeight,
            window.innerWidth,
         );
         buildingNewShape({
            mouseX,
            mouseY,
            ctx: this.fallbackContext,
            shape: this.newShapeParams,
         });
      }

      /* resize_move */
      if (this.resizeShape) {
         const shape = this.canvasShapes[this.resizeShape.index];
         resizeMove({
            direction: this.resizeShape.direction,
            mouseX,
            mouseY,
            resizeShape: this.resizeShape.shape,
            shape,
         });

         this.draw();
         return;
      }
   }

   mouse_Up(e: MouseEvent) {
      const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
      /* inset shape */
      if (this.newShapeParams) {
         buildShape({ mouseX, mouseY, shape: this.newShapeParams });

         this.canvasShapes.push(this.newShapeParams);
         /* update mode after new shape */
         cConf.currMode = "pointer";
         this.afterNewShape({
            shape: this.newShapeParams,
            mode: cConf.currMode,
         });

         this.reset();
      }

      if (this.resizeShape) {
         reEvaluateShape(this.canvasShapes[this.resizeShape.index]);
      }

      this.reset();
   }

   mouseClick(e: MouseEvent) {
      const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
      if (cConf.currMode === "text") {
         this.insertText(mouseX, mouseY);
         return;
      }
   }

   mouseDblClick(e: MouseEvent) {
      const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
      if (cConf.currMode === "pointer") {
         this.insertText(mouseX, mouseY);
         return;
      }
   }

   resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.fallbackCanvas.width = window.innerWidth;
      this.fallbackCanvas.height = window.innerHeight;
   }

   getTransformedMouseCoords(event: MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      // Adjust for canvas position on the page
      let mouseX = event.clientX - rect.left;
      let mouseY = event.clientY - rect.top;

      // Adjust for scroll positions and scale
      mouseX = (mouseX + cConf.offset.x - centerX) / cConf.scale.x + centerX;
      mouseY = (mouseY + cConf.offset.y - centerY) / cConf.scale.y + centerY;

      return { x: mouseX, y: mouseY };
   }

   insertText(mouseX: number, mouseY: number) {
      const nt = new DefaultShape({ x: mouseX, y: mouseY });
      const newText: CanvasShape = { id: uuidv4(), props: nt, type: "text" };
      createNewText({
         mouseX,
         mouseY,
         fSize: newText.props.fontSize,
         blurEvent: ({ text, h, w }) => {
            if (!text.length) return;
            newText.props.text = text;
            newText.props.w = w;
            newText.props.h = h;

            cConf.activeShapes.add(newText.id);
            cConf.currMode = "pointer";

            this.afterNewShape({ mode: cConf.currMode, shape: newText });

            this.canvasShapes.push(newText);
            this.reset();
         },
      });
   }

   reset() {
      this.clearRect(
         this.fallbackContext,
         this.fallbackCanvas.width,
         this.fallbackCanvas.height,
      );
      this.resizeShape = undefined;
      this.dragShape = undefined;
      this.newShapeParams = null;
      this.draw();
   }

   initialize() {
      this.canvas.addEventListener("mousedown", this.mouse_Down.bind(this));
      this.canvas.addEventListener("mousemove", this.mouse_Move.bind(this));
      this.canvas.addEventListener("mouseup", this.mouse_Up.bind(this));
      this.canvas.addEventListener("dblclick", this.mouseDblClick.bind(this));
      this.canvas.addEventListener("click", this.mouseClick.bind(this));
      window.addEventListener("resize", this.resizeCanvas.bind(this));
   }

   cleanup() {
      this.canvas.removeEventListener("mousedown", this.mouse_Down.bind(this));
      this.canvas.removeEventListener("mousemove", this.mouse_Move.bind(this));
      this.canvas.removeEventListener("mouseup", this.mouse_Up.bind(this));
      this.canvas.removeEventListener("click", this.mouseClick.bind(this));
      this.canvas.removeEventListener(
         "dblclick",
         this.mouseDblClick.bind(this),
      );
      window.removeEventListener("resize", this.resizeCanvas.bind(this));
   }
}

export default CanvasClass;
