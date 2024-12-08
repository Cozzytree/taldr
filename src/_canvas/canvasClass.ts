import { v4 as uuidv4 } from "uuid";
import {
  buildingNewShape,
  buildShape,
  createNewText,
  intializeShape,
} from "./newShape";
import drawText from "./draw/drawText";
import { Bin, Restore } from "./redoundo";
import { drawLine } from "./draw/drawline";
import { rectDraw } from "./draw/drawRect";
import { createGuide } from "./showGuides";
import { drawPencil } from "./draw/drawPencil";
import { drawEllipse } from "./draw/drawEllipse";
import { addTextToShape } from "./add_text_shape";
import { dragMove } from "./resizeAndDrag/dragMove";
import DefaultShape, { cConf } from "./canvasConfig";
import { resizeMove } from "./resizeAndDrag/resizeMove";
import { getDragShape } from "./resizeAndDrag/getDragShape";
import { getResizeShape } from "./resizeAndDrag/getResizeshape";
import { lineConnection } from "./resizeAndDrag/line_connection";
import {
  cursorHelper,
  duplicateShape,
  getOffsets,
  isInside,
  reEvaluateShape,
} from "./utils";
import { CanvasShape, modes, ResizeDirection, shapeType } from "./canvasTypes";
import { checkShapeInsideSelection, selectonDrawRect } from "./selection";
import { drawTriangle } from "@/_canvas/draw/drawTriangle.tsx";
import drawPath from "@/_canvas/_components/drawPath.tsx";
import { rectResizeParams } from "@/_canvas/resizeAndDrag/resizeParams.ts";
import { drawImage } from "./draw/drawImage";

interface onChangeProps {
  currentMode: modes;
  activeShapes: Map<string, boolean>;
}

interface contructProps {
  isEditable: boolean;
  canvas: HTMLCanvasElement;
  fallbackCanvas: HTMLCanvasElement;
  initialShapes: CanvasShape[] | undefined;
  onChange: ({ currentMode, activeShapes }: onChangeProps) => void;
  updateaftermouseup: ({ shapes }: { shapes: CanvasShape[] }) => void;
}

class CanvasClass {
  // Declare properties to store the bound function references
  imageMap: Map<string, HTMLImageElement> = new Map();
  mouseDownPoint: { x: number; y: number } = { x: 0, y: 0 };
  currentMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  canvasShapes: CanvasShape[] = [];
  emptyIndexes: number[];
  copies: string[] = [];

  newShapeParams: null | CanvasShape;
  shapeGuides: Map<string, { x: number; y: number; w: number; h: number }>;
  activeColor = "#20ff20";
  tolerance: number;
  dragShape: number | undefined;
  resizeShape:
    | {
        index: number;
        shape: CanvasShape;
        direction: ResizeDirection | false;
      }
    | undefined;

  isEditable: boolean;

  multipleSelection = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    isSelected: false,
    isSelecting: false,
    isSelectedDown: false,
  };
  freeModeIsDown: boolean;
  initialShapes: CanvasShape[] | undefined;

  canvas: HTMLCanvasElement;
  fallbackCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fallbackContext: CanvasRenderingContext2D;
  onChange: ({ currentMode, activeShapes }: onChangeProps) => void;
  updateaftermouseup: ({ shapes }: { shapes: CanvasShape[] }) => void;

  constructor({
    canvas,
    onChange,
    isEditable,
    initialShapes,
    updateaftermouseup,
    fallbackCanvas,
  }: contructProps) {
    this.canvas = canvas;
    this.fallbackCanvas = fallbackCanvas;
    this.initialShapes = initialShapes;
    this.tolerance = 5;

    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("canvas not supported");

    const fallbackContext = this.fallbackCanvas.getContext("2d");
    if (!fallbackContext) throw new Error("canvas not supported");

    this.emptyIndexes = [];
    this.newShapeParams = null;
    this.shapeGuides = new Map();
    this.dragShape = undefined;
    this.resizeShape = undefined;
    this.freeModeIsDown = false;

    this.isEditable = isEditable;

    this.ctx = context;
    this.onChange = onChange;
    this.fallbackContext = fallbackContext;
    this.updateaftermouseup = updateaftermouseup;

    this.mouse_Up = this.mouse_Up.bind(this);
    this.mouse_Down = this.mouse_Down.bind(this);
    this.mouse_Move = this.mouse_Move.bind(this);
    this.mouseClick = this.mouseClick.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.mouseDblClick = this.mouseDblClick.bind(this);
    this.zoomAndScroll = this.zoomAndScroll.bind(this);
    this.documentKeyDown = this.documentKeyDown.bind(this);

    if (this.initialShapes && this.initialShapes.length > 0) {
      initialShapes?.forEach((s) => {
        if (s) {
          if (s.type === "image" && s.props.image) {
            const i = new Image();
            i.src = s.props.image;
            this.imageMap.set(s.id, i);
          }
          this.canvasShapes.push(s);
        }
      });
    }
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
      if (!shape) return;

      if (cConf.scale.x === 1) {
        if (
          (shape.props.x + shape.props.w - cConf.offset.x) / cConf.scale.x <=
            0 ||
          shape.props.x + shape.props.w + cConf.offset.x >
            this.canvas.width + shape.props.w
        )
          return;
        if (
          (shape.props.y + shape.props.h - cConf.offset.y) / cConf.scale.y <=
            0 ||
          shape.props.y + shape.props.h + cConf.offset.y >
            this.canvas.height + shape.props.h
        )
          return;
      } else {
        if (
          (shape.props.x + shape.props.w * 2 - cConf.offset.x) /
            cConf.scale.x <=
            -this.canvas.width * 0.5 ||
          shape.props.x + shape.props.w + cConf.offset.x >
            this.canvas.width + this.canvas.width * 0.5
        )
          return;
        if (
          shape.props.y - cConf.offset.y + shape.props.h * 2 <=
            -this.canvas.width * 0.5 ||
          shape.props.y + shape.props.h + cConf.offset.y >
            this.canvas.height + this.canvas.width * 0.5
        )
          return;
      }

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
        case "pencil":
          drawPencil({
            ctx: this.ctx,
            isActive,
            shape: shape.props,
            shouldRestore: false,
            tolerance: this.tolerance,
            activeColor: this.activeColor,
            massiveSelected: this.multipleSelection.isSelected,
          });
          break;
        case "figure":
          rectDraw({
            isActive,
            showName: true,
            rect: {
              ...shape.props,
              fill: "transparent",
              stroke: "white",
              lineWidth: 2,
            },
            context: this.ctx,
            shouldRestore: false,
            tolerance: this.tolerance,
            activeColor: this.activeColor,
            massiveSelected: this.multipleSelection.isSelected,
          });
          break;
        case "triangle":
          drawTriangle({
            shape,
            isActive,
            ctx: this.ctx,
            shouldRestore: false,
            tolerance: this.tolerance,
            activeColor: this.activeColor,
            isMassiveSelected: this.multipleSelection.isSelected,
          });
          break;
        case "others":
          drawPath({
            shape,
            isActive,
            ctx: this.ctx,
            shouldRestore: false,
            tolerance: this.tolerance,
            activeColor: this.activeColor,
            isMassiveSelected: this.multipleSelection.isSelected,
          });
          break;
        case "image":
          drawImage({
            isActive,
            img: shape,
            ctx: this.ctx,
            imgElement: this.imageMap.get(shape.id),
            shouldRestore: false,
            tolerance: this.tolerance,
            activeColor: this.activeColor,
            isMassiveSelected: this.multipleSelection.isSelected,
          });
          break;
      }
    });

    this.ctx.restore();
  }

  mouse_Down(e: PointerEvent | TouchEvent) {
    // e.preventDefault();
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
    if (!this.isEditable) {
      this.mouseDownPoint = { x: mouseX, y: mouseY };
      this.freeModeIsDown = true;
      return;
    }

    this.mouseDownPoint = { x: mouseX, y: mouseY };

    // @ts-expect-error it is necessary
    if ("CANVAS" !== e.target?.tagName) {
      return;
    }

    if (cConf.currMode === "hands_free") {
      this.mouseDownPoint = { x: mouseX, y: mouseY };
      this.freeModeIsDown = true;
      return;
    }

    if (this.multipleSelection.isSelected) {
      if (
        isInside({
          inner: { x: mouseX, y: mouseY, w: 0, h: 0 },
          outer: {
            x: this.multipleSelection.x,
            y: this.multipleSelection.y,
            w: this.multipleSelection.width,
            h: this.multipleSelection.height,
          },
        })
      ) {
        this.canvasShapes.forEach((s) => {
          if (!s || !cConf.activeShapes.has(s.id)) return;
          getOffsets({ mouseX, mouseY, shape: s });
        });
        this.multipleSelection.isSelectedDown = true;
        this.multipleSelection.offsetX = mouseX - this.multipleSelection.x;
        this.multipleSelection.offsetY = mouseY - this.multipleSelection.y;
        return;
      } else {
        this.multipleSelection.isSelected = false;
        this.multipleSelection.isSelecting = false;
        this.multipleSelection.isSelectedDown = false;
      }
    }

    if (cConf.currMode !== "pointer") {
      this.newShapeParams = intializeShape({
        initialPoint: { x: mouseX, y: mouseY },
        shapeType: cConf.currMode as shapeType,
      }) as CanvasShape;
      return;
    }

    let isResizeorDrag = false;
    /* resize shape */
    for (let index = 0; index < this.canvasShapes.length; index++) {
      if (
        !this.canvasShapes[index] ||
        (this.canvasShapes[index].type !== "text" &&
          !cConf.activeShapes.get(this.canvasShapes[index].id))
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
        this.resizeShape = { index: index, shape, direction };
        isResizeorDrag = true;
        /* add to bin */
        Bin.push({
          type: "common",
          shapes: [shape],
        });
        break;
      }
    }

    if (isResizeorDrag) {
      this.draw();
      return;
    }

    // cConf.activeShapes.clear(); /* clear actives */

    /* drag shape */
    let Sdrag_shape: number | null = null;
    for (let index = 0; index < this.canvasShapes.length; index++) {
      if (!this.canvasShapes[index]) continue;

      if (getDragShape({ mouseX, mouseY, shape: this.canvasShapes[index] })) {
        if (
          Sdrag_shape == null ||
          this.canvasShapes[Sdrag_shape].props.w >
            this.canvasShapes[index].props.w
        ) {
          Sdrag_shape = index;
        }
      }
    }

    /* check the dragShape */
    if (Sdrag_shape !== null) {
      this.dragShape = Sdrag_shape;

      /* add to bin */
      Bin.push({
        type: "common",
        shapes: [JSON.parse(JSON.stringify(this.canvasShapes[Sdrag_shape]))],
      });

      /* get offset */
      if (this.canvasShapes[Sdrag_shape].type === "figure") {
        this.canvasShapes.forEach((s) => {
          if (!s || s.id === this.canvasShapes[Sdrag_shape].id) return;
          if (s.props.containerId === this.canvasShapes[Sdrag_shape].id) {
            getOffsets({ mouseX, mouseY, shape: s });
          }
        });
      }
      getOffsets({ mouseX, mouseY, shape: this.canvasShapes[Sdrag_shape] });

      this.draw();
      return;
    }

    /* start massive selection */
    if (!this.dragShape && !this.resizeShape) {
      this.multipleSelection.isSelecting = true;
      this.multipleSelection.x = mouseX;
      this.multipleSelection.y = mouseY;
    }

    // this.draw();
  }

  mouse_Move(e: PointerEvent | TouchEvent) {
    e.preventDefault();
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

    if (this.freeModeIsDown) {
      if (mouseX > this.mouseDownPoint.x) {
        cConf.offset.x = cConf.offset.x - (mouseX - this.mouseDownPoint.x);
      } else {
        cConf.offset.x = cConf.offset.x + (this.mouseDownPoint.x - mouseX);
      }
      if (mouseY > this.mouseDownPoint.y) {
        cConf.offset.y = cConf.offset.y - (mouseY - this.mouseDownPoint.y);
      } else {
        cConf.offset.y = cConf.offset.y + (this.mouseDownPoint.y - mouseY);
      }

      this.draw();
      return;
    }

    if (!this.isEditable) return;

    /* cursor helper */
    let hasCur = false;
    this.canvasShapes.forEach((s) => {
      if (!s || !cConf.activeShapes.has(s.id)) return;
      const resize = rectResizeParams({
        mouseX,
        mouseY,
        y: s.props.y,
        x: s.props.x,
        width: s.props.w,
        height: s.props.h,
        tolerance: this.tolerance,
      });
      const p = resize.find((s) => s.condition);
      if (p) {
        cursorHelper({
          direction: p.side,
        });
        hasCur = true;
      }
    });
    if (!hasCur) {
      document.body.style.cursor = "default";
    }

    this.currentMousePosition = { x: mouseX, y: mouseY };

    if (this.multipleSelection.isSelectedDown) {
      this.multipleSelection.x = mouseX - this.multipleSelection.offsetX;
      this.multipleSelection.y = mouseY - this.multipleSelection.offsetY;

      this.clearRect(
        this.fallbackContext,
        this.fallbackCanvas.width,
        this.fallbackCanvas.height,
      );

      selectonDrawRect({
        ctx: this.fallbackContext,
        params: {
          x: this.multipleSelection.x,
          y: this.multipleSelection.y,
          w: this.multipleSelection.width,
          h: this.multipleSelection.height,
        },
      });

      this.canvasShapes.forEach((s) => {
        if (!s || !cConf.activeShapes.has(s.id)) return;
        dragMove({
          allShapes: this.canvasShapes,
          mouseX,
          mouseY,
          shape: s,
        });
      });
      this.draw();
      return;
    }

    if (this.multipleSelection.isSelecting) {
      this.clearRect(
        this.fallbackContext,
        this.fallbackCanvas.width,
        this.fallbackCanvas.height,
      );
      selectonDrawRect({
        ctx: this.fallbackContext,
        params: {
          x: this.multipleSelection.x,
          y: this.multipleSelection.y,
          w: mouseX - this.multipleSelection.x,
          h: mouseY - this.multipleSelection.y,
        },
      });
    }

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
        shape: this.newShapeParams as CanvasShape,
      });
    }

    /* resize_move- */
    if (this.resizeShape) {
      const shape = this.canvasShapes[this.resizeShape.index];
      resizeMove({
        mouseX,
        mouseY,
        shape,
        shapes: this.canvasShapes,
        resizeShape: this.resizeShape.shape,
        direction: this.resizeShape.direction,
      });

      this.draw();
      return;
    }

    /* drag shape */
    if (this.dragShape !== undefined) {
      const shape = this.canvasShapes[this.dragShape];

      dragMove({ mouseX, mouseY, shape, allShapes: this.canvasShapes });

      this.showShapeGuides({ movedShape: shape });

      this.draw();
      return;
    }
  }

  mouse_Up(e: PointerEvent | TouchEvent) {
    if (!this.isEditable) {
      this.freeModeIsDown = false;
      return;
    }

    e.preventDefault();
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

    if (this.freeModeIsDown) {
      this.freeModeIsDown = false;
      return;
    }

    if (this.multipleSelection.isSelected) {
      this.multipleSelection.isSelectedDown = false;
      this.canvasShapes.forEach((s) => {
        if (!s || !cConf.activeShapes.has(s.id)) return;
        reEvaluateShape(s, this.canvasShapes);
      });

      this.clearRect(
        this.fallbackContext,
        this.fallbackCanvas.width,
        this.fallbackCanvas.height,
      );
      selectonDrawRect({
        ctx: this.fallbackContext,
        params: {
          x: this.multipleSelection.x,
          y: this.multipleSelection.y,
          w: this.multipleSelection.width,
          h: this.multipleSelection.height,
        },
      });

      this.draw();
      return;
    }

    if (this.multipleSelection.isSelecting) {
      if (mouseX > this.multipleSelection.x) {
        this.multipleSelection.width = mouseX - this.multipleSelection.x;
      } else {
        this.multipleSelection.width = this.multipleSelection.x - mouseX;
        this.multipleSelection.x = mouseX;
      }

      if (mouseY > this.multipleSelection.y) {
        this.multipleSelection.height = mouseY - this.multipleSelection.y;
      } else {
        this.multipleSelection.height = this.multipleSelection.y - mouseY;
        this.multipleSelection.y = mouseY;
      }

      const { x, y, w, h } = checkShapeInsideSelection({
        allShapes: this.canvasShapes,
        selection: {
          x: this.multipleSelection.x,
          y: this.multipleSelection.y,
          w: this.multipleSelection.width,
          h: this.multipleSelection.height,
        },
      });

      /* massive selection rect */
      this.multipleSelection.isSelecting = false;
      if (w > 20 && h > 20) {
        this.multipleSelection.isSelected = true;
        this.clearRect(
          this.fallbackContext,
          this.fallbackCanvas.width,
          this.fallbackCanvas.height,
        );
        selectonDrawRect({
          ctx: this.fallbackContext,
          params: { x, y, w, h },
        });
        this.draw();
        return;
      }
    }

    /* inset shape */
    if (this.newShapeParams) {
      buildShape({ mouseX, mouseY, shape: this.newShapeParams });

      if (
        this.newShapeParams.type === "image" &&
        this.newShapeParams.props.image
      ) {
        const newI = new Image();
        newI.src = this.newShapeParams.props.image;
        this.imageMap.set(this.newShapeParams?.id || "", newI);
      }

      this.findEmptyIndexAndInsert(this.newShapeParams);
      // this.canvasShapes.push(this.newShapeParams);

      /* add to bin */
      Bin.push({ type: "fresh", shapes: [this.newShapeParams] });

      /* update mode after new shape */
      if (this.newShapeParams.type !== "pencil") {
        cConf.currMode = "pointer";
        cConf.activeShapes.set(this.newShapeParams.id, true);
      }
    }

    if (this.resizeShape !== undefined) {
      const r_Shape = this.canvasShapes[this.resizeShape.index];

      /* connect line */
      if (r_Shape.type === "line" && r_Shape.props.points) {
        let p;
        if (this.resizeShape.direction === "top-edge") {
          p = lineConnection({
            allShapes: this.canvasShapes,
            point: r_Shape.props.points[0],
          });
        } else if (this.resizeShape.direction === "bottom-edge") {
          p = lineConnection({
            allShapes: this.canvasShapes,
            point: r_Shape.props.points[r_Shape.props.points.length - 1],
          });
        }

        /* valitate if the point is valid */
        if (
          p == null ||
          this.canvasShapes[p].id === r_Shape.id ||
          this.canvasShapes[p].type === "line"
        ) {
          if (this.resizeShape.direction === "top-edge") {
            r_Shape.props.startShape = null;
          } else {
            r_Shape.props.endShape = null;
          }
        } else {
          /* calculate percentage */
          const xPer =
            ((mouseX - this.canvasShapes[p].props.x) /
              this.canvasShapes[p].props.w) *
            100;
          const yPer =
            ((mouseY - this.canvasShapes[p].props.y) /
              this.canvasShapes[p].props.h) *
            100;

          const followPoint = {
            x:
              this.canvasShapes[p].props.x +
              (xPer / 100) * this.canvasShapes[p].props.w,
            y:
              this.canvasShapes[p].props.y +
              (yPer / 100) * this.canvasShapes[p].props.h,
          };

          if (this.resizeShape.direction == "top-edge") {
            if (r_Shape.props.endShape) {
              if (r_Shape.props.endShape.shapeId === this.canvasShapes[p].id)
                return;
            }

            r_Shape.props.startShape = {
              xPer,
              yPer,
              followPoint,
              shapeId: this.canvasShapes[p].id,
            };
          } else if (this.resizeShape.direction == "bottom-edge") {
            if (r_Shape.props.startShape) {
              if (r_Shape.props.startShape.shapeId === this.canvasShapes[p].id)
                return;
            }

            r_Shape.props.endShape = {
              xPer,
              yPer,
              followPoint,
              shapeId: this.canvasShapes[p].id,
            };
          }
        }
      }

      reEvaluateShape(r_Shape, this.canvasShapes);

      cConf.activeShapes.set(
        this.canvasShapes[this.resizeShape.index].id,
        true,
      ); /* add to actives */
      this.insertShapeGuide({
        id: this.canvasShapes[this.resizeShape.index].id,
        v: this.canvasShapes[this.resizeShape.index].props,
      });
    }

    if (this.dragShape !== undefined) {
      cConf.activeShapes.delete(this.canvasShapes[this.dragShape].id);

      reEvaluateShape(this.canvasShapes[this.dragShape], this.canvasShapes);

      cConf.activeShapes.set(
        this.canvasShapes[this.dragShape].id,
        true,
      ); /* add to actives */

      this.insertShapeGuide({
        id: this.canvasShapes[this.dragShape].id,
        v: this.canvasShapes[this.dragShape].props,
      });
    }

    this.reset();

    /* change callback */
    this.onChange({
      currentMode: cConf.currMode,
      activeShapes: cConf.activeShapes,
    });

    // @ts-expect-error it is necessary
    if ("CANVAS" === e.target?.tagName) {
      this.updateaftermouseup({ shapes: this.canvasShapes });
    }
  }

  mouseClick(e: TouchEvent | PointerEvent) {
    if (!this.isEditable) return;
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

    if (cConf.currMode === "text") {
      this.insertText(mouseX, mouseY);
      return;
    }
  }

  mouseDblClick(e: MouseEvent) {
    if (!this.isEditable) return;
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

    /* insert test to shape */
    let clickedInsideShape = false;
    for (let index = 0; index < this.canvasShapes.length; index++) {
      if (!this.canvasShapes[index]) continue;

      const canvasOffsetX = this.canvas.getBoundingClientRect().left;
      const canvasOffsetY = this.canvas.getBoundingClientRect().top;
      if (
        addTextToShape({
          canvasOffsetX,
          canvasOffsetY,
          mouseX,
          mouseY,
          shape: this.canvasShapes[index],
          fn: (text) => {
            this.canvasShapes[index].props.text = text;
            this.reset();
          },
        })
      ) {
        clickedInsideShape = true;
        break;
      }
    }

    if (clickedInsideShape) return;

    if (cConf.currMode === "pointer") {
      this.insertText(mouseX, mouseY);
      return;
    }
  }

  documentKeyDown(e: KeyboardEvent) {
    if (!this.isEditable) return;
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.key === "d") {
        this.canvasShapes.forEach((shape) => {
          if (!shape || !cConf.activeShapes.has(shape.id)) return;

          const s = duplicateShape({ shape, imageMap: this.imageMap });
          if (s) {
            /* delete from actives */
            cConf.activeShapes.delete(shape.id);

            this.canvasShapes.push(s);

            /* add to bin */
            Bin.push({ type: "fresh", shapes: [s] });

            /* insert guides */
            this.insertShapeGuide({ id: s.id, v: s.props });

            /* insert to actives */
            cConf.activeShapes.set(s.id, true);
          }
        });
      } else if (e.key === "a") {
        this.canvasShapes.forEach((s) => {
          if (!s) return;
          cConf.activeShapes.set(s.id, true);
        });
      } else if (e.key === "c") {
        this.copies = [];
        this.canvasShapes.forEach((s) => {
          if (!s) return;
          if (cConf.activeShapes.has(s.id)) {
            const c = { ...s };

            c.props.offsetX = this.currentMousePosition.x - c.props.x;
            c.props.offsetY = this.currentMousePosition.y - c.props.y;

            this.copies.push(JSON.stringify(c));
          }
        });
      } else if (e.key === "v") {
        this.copies.forEach((s) => {
          const c = JSON.parse(s) as CanvasShape;
          c.id = uuidv4();
          c.props.x = this.currentMousePosition.x - c.props.offsetX;
          c.props.y = this.currentMousePosition.y - c.props.offsetY;

          this.findEmptyIndexAndInsert(c);
        });
      } else if (e.key === "z") {
        this.undo();
      } else if (e.key === "y") {
        this.redo();
      }
    } else if (e.key === "Delete") {
      const shapes = this.deleteShapes();

      if (shapes) Bin.push({ type: "delete", shapes });
    }

    /* change callback */
    this.onChange({
      activeShapes: cConf.activeShapes,
      currentMode: cConf.currMode,
    });
    this.reset();
  }

  deleteShapes() {
    if (!this.isEditable) return;
    const toBin: CanvasShape[] = [];
    this.canvasShapes.forEach((s, index) => {
      if (!s) return;
      if (cConf.activeShapes.has(s.id)) {
        if (s.type === "figure") {
          this.canvasShapes.forEach((a, i) => {
            if (s && s.props.containerId === s.id) {
              // remove cached image

              if (s.type == "image") {
                this.imageMap.delete(s.id);
              }
              this.canvasShapes.splice(i, 1);
              toBin.push(JSON.parse(JSON.stringify(a)));
            }
          });
        }

        /* remove cached image */
        if (s.type == "image") {
          this.imageMap.delete(s.id);
        }

        cConf.activeShapes.delete(s.id);
        this.shapeGuides.delete(s.id);
        toBin.push(JSON.parse(JSON.stringify(s)));
        this.canvasShapes.splice(index, 1);
      }
    });

    return toBin;
  }

  undo() {
    const shapes: CanvasShape[] = [];
    /* get back from bin */
    const binShapes = Bin.pop();

    if (binShapes) {
      switch (binShapes.type) {
        case "delete":
          /* create the shapes */
          binShapes.shapes.forEach((s) => {
            shapes.push(JSON.parse(JSON.stringify(s)));

            if (s.type == "image" && s.props.image) {
              const i = new Image();
              i.src = s.props.image;
              this.imageMap.set(s.id, i);
            }

            this.findEmptyIndexAndInsert(s);
          });
          break;
        case "fresh":
          /* delete the shapes */
          binShapes.shapes.forEach((s) => {
            const v = this.canvasShapes.findIndex((c) => c?.id === s.id);
            if (v !== -1) {
              shapes.push(JSON.parse(JSON.stringify(this.canvasShapes[v])));
              this.canvasShapes.splice(v, 1);
            }
          });
          break;
        case "common":
          binShapes.shapes.forEach((s) => {
            const v = this.canvasShapes.findIndex((v) => v?.id === s.id);
            if (v !== -1) {
              shapes.push(JSON.parse(JSON.stringify(this.canvasShapes[v])));
              this.canvasShapes[v] = s;
            }
          });
          break;
      }

      /* i dont know what to say */
      Restore.push({ type: binShapes.type, shapes });
    }
  }

  redo() {
    const shapes: CanvasShape[] = [];
    /* revert */
    const restore = Restore.pop();

    if (restore) {
      switch (restore.type) {
        case "delete":
          /* delete the shapes */
          restore.shapes.forEach((s) => {
            const v = this.canvasShapes.findIndex((c) => c?.id === s.id);
            if (v !== -1) {
              if (s.type == "image") {
                this.imageMap.delete(s.id);
              }
              shapes.push(JSON.parse(JSON.stringify(this.canvasShapes[v])));
              this.canvasShapes.splice(v, 1);
            }
          });
          break;
        case "fresh":
          /* create the shapes */
          restore.shapes.forEach((s) => {
            shapes.push(JSON.parse(JSON.stringify(s)));
            this.findEmptyIndexAndInsert(s);
          });
          break;
        case "common":
          restore.shapes.forEach((s) => {
            const v = this.canvasShapes.findIndex((v) => v?.id === s.id);
            if (v !== -1) {
              shapes.push(JSON.parse(JSON.stringify(this.canvasShapes[v])));
              this.canvasShapes[v] = s;
            }
          });
          break;
      }

      /* i dont know what to say */
      Bin.push({ type: restore.type, shapes });
    }
  }

  findEmptyIndexAndInsert(shape: CanvasShape) {
    const popped = this.emptyIndexes.pop();
    if (popped !== undefined) {
      this.canvasShapes[popped] = shape;
    } else {
      this.canvasShapes.push(shape);
    }
    /* insert to guides */
    this.insertShapeGuide({
      id: shape.id,
      v: {
        x: shape.props.x,
        y: shape.props.y,
        w: shape.props.w,
        h: shape.props.h,
      },
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.fallbackCanvas.width = window.innerWidth;
    this.fallbackCanvas.height = window.innerHeight;
    this.draw();
    if (this.multipleSelection.isSelected) {
      this.clearRect(
        this.fallbackContext,
        window.innerWidth,
        window.innerHeight,
      );
      selectonDrawRect({
        ctx: this.fallbackContext,
        params: {
          x: this.multipleSelection.x,
          y: this.multipleSelection.y,
          w: this.multipleSelection.width,
          h: this.multipleSelection.height,
        },
      });
    }
  }

  getTransformedMouseCoords(event: PointerEvent | TouchEvent | MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Handle pointer event (mouse or touch)
    let mouseX, mouseY;

    if (event instanceof PointerEvent || event instanceof MouseEvent) {
      // Pointer event (mouse)
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    } else if (event instanceof TouchEvent) {
      // Touch event (single touch)
      const touch = event.touches[0]; // Get the first touch point
      mouseX = touch?.clientX ?? 0 - rect.left;
      mouseY = touch?.clientY ?? 0 - rect.top;
    }

    // Adjust for scroll positions and scale
    mouseX =
      ((mouseX ?? 0) + cConf.offset.x - centerX) / cConf.scale.x + centerX;
    mouseY =
      ((mouseY ?? 0) + cConf.offset.y - centerY) / cConf.scale.y + centerY;

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

        cConf.activeShapes.set(newText.id, true);
        cConf.currMode = "pointer";

        /* callback after new_shape */
        this.onChange({
          activeShapes: cConf.activeShapes,
          currentMode: cConf.currMode,
        });
        this.updateaftermouseup({
          shapes: this.canvasShapes,
        });

        this.findEmptyIndexAndInsert(newText);

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
    this.fallbackContext.restore();

    this.resizeShape = undefined;
    this.dragShape = undefined;
    this.newShapeParams = null;
    this.draw();
  }

  insertShapeGuide({
    id,
    v,
  }: {
    id: string;
    v: { x: number; y: number; w: number; h: number };
  }) {
    this.shapeGuides.set(id, v);
  }

  showShapeGuides({ movedShape }: { movedShape: CanvasShape }) {
    const hasGuide = this.shapeGuides.get(movedShape.id);
    if (!hasGuide) return;

    const shape = movedShape.props;
    let isGuide = false;

    this.clearRect(
      this.fallbackContext,
      this.fallbackCanvas.height,
      this.fallbackCanvas.width,
    );

    this.fallbackContext.strokeStyle = "#ff0000";
    this.fallbackContext.fillStyle = "#ff0000";

    this.fallbackContext.lineWidth = 1.5;

    this.shapeGuides.forEach((g, key) => {
      if (key === movedShape.id) return;

      if (createGuide({ ctx: this.fallbackContext, guide: g, shape })) {
        isGuide = true;
      }
    });

    if (isGuide) {
      this.fallbackContext.stroke();
      this.fallbackContext.fill();
    }
    this.fallbackContext.restore();
  }

  zoomAndScroll(e: WheelEvent) {
    const { x, y } = this.getTransformedMouseCoords(e);

    if (e.ctrlKey) {
      e.preventDefault();
      const midX = this.canvas.width * 0.5;
      const midY = this.canvas.height * 0.5;

      const xPer = ((x - midX) / midX) * 100;
      const yPer = ((x - midY) / midY) * 100;

      if (e.deltaY > 0) {
        if (cConf.scale.x <= 0.6) return;
        if (x > midX) {
          cConf.offset.x += xPer / 10;
        } else {
          cConf.offset.x -= xPer / 10;
        }

        if (y > midY) {
          cConf.offset.y -= yPer / 10;
        } else {
          cConf.offset.y += yPer / 10;
        }

        cConf.scale.y /= 1.1;
        cConf.scale.x /= 1.1;
      } else {
        if (x > midX) {
          cConf.offset.x -= xPer / 10;
        } else {
          cConf.offset.x += xPer / 10;
        }

        if (y > midY) {
          cConf.offset.y += yPer / 10;
        } else {
          cConf.offset.y -= yPer / 10;
        }
        cConf.scale.x *= 1.1;
        cConf.scale.y *= 1.1;
      }
    } else {
      if (e.deltaY > 0) {
        cConf.offset.y += 20;
      } else {
        cConf.offset.y -= 20;
      }
    }
    cConf.scale.x = Math.round(cConf.scale.x * 10) / 10;
    cConf.scale.y = Math.round(cConf.scale.y * 10) / 10;
    this.draw();
  }

  initialize() {
    /* initialize config */
    cConf.activeShapes = new Map();
    cConf.currMode = "pointer";
    cConf.scale = { x: 1, y: 1 };
    cConf.offset = { x: 0, y: 0 };

    // Add event listeners with passive: false
    this.canvas.addEventListener("touchstart", this.mouse_Down);
    this.canvas.addEventListener("touchmove", this.mouse_Move, {
      passive: false,
    });
    this.canvas.addEventListener("touchstart", this.mouseClick);
    this.canvas.addEventListener("touchend", this.mouse_Up, { passive: false });
    this.canvas.addEventListener("touchcancel", this.mouse_Up, {
      passive: false,
    });

    // Add pointer event listeners (optional)
    document.addEventListener("pointerdown", this.mouse_Down);
    document.addEventListener("pointermove", this.mouse_Move);
    document.addEventListener("pointerup", this.mouse_Up);

    // Canvas event listeners
    this.canvas.addEventListener("dblclick", this.mouseDblClick);
    this.canvas.addEventListener("pointerdown", this.mouseClick);

    // Global document and window listeners
    document.addEventListener("keydown", this.documentKeyDown);
    window.addEventListener("resize", this.resizeCanvas);
    this.canvas.addEventListener("wheel", this.zoomAndScroll);
  }

  cleanup() {
    // Remove event listeners using the stored references
    document.removeEventListener("pointerdown", this.mouse_Down);
    document.removeEventListener("pointermove", this.mouse_Move);
    document.removeEventListener("pointerup", this.mouse_Up);

    // Remove touch event listeners
    this.canvas.removeEventListener("touchstart", this.mouse_Down);
    this.canvas.removeEventListener("touchmove", this.mouse_Move);
    this.canvas.removeEventListener("touchend", this.mouse_Up);

    // Remove canvas event listeners
    this.canvas.removeEventListener("dblclick", this.mouseDblClick);
    this.canvas.removeEventListener("touchstart", this.mouseClick);

    // Remove global document and window listeners
    document.removeEventListener("keydown", this.documentKeyDown);
    window.removeEventListener("resize", this.resizeCanvas);
    this.canvas.removeEventListener("wheel", this.zoomAndScroll);
  }
}

export default CanvasClass;
