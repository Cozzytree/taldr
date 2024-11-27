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
import { duplicateShape, getOffsets, isInside, reEvaluateShape } from "./utils";
import { CanvasShape, modes, ResizeDirection, shapeType } from "./canvasTypes";
import { checkShapeInsideSelection, selectonDrawRect } from "./selection";

interface onChangeProps {
  shapes: CanvasShape[];
  currentMode: modes;
  activeShapes: Map<string, boolean>;
}

interface contructProps {
  canvas: HTMLCanvasElement;
  fallbackCanvas: HTMLCanvasElement;
  onChange: ({ shapes, currentMode, activeShapes }: onChangeProps) => void;
  afterNewShape: ({ mode, shape }: { mode: modes; shape: CanvasShape }) => void;
}

class CanvasClass {
  currentMousePosition = { x: 0, y: 0 };
  canvasShapes: CanvasShape[] = [];
  emptyIndexes: number[] = [];
  copies: string[] = [];

  newShapeParams: null | CanvasShape = null;
  shapeGuides: Map<string, { x: number; y: number; w: number; h: number }> =
    new Map();
  activeColor = "#20ff20";
  tolerance = 4;
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
    isSelecting: false,
    isSelectedDown: false,
  };

  canvas: HTMLCanvasElement;
  fallbackCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fallbackContext: CanvasRenderingContext2D;
  onChange: ({ shapes, currentMode, activeShapes }: onChangeProps) => void;
  afterNewShape: ({ mode, shape }: { mode: modes; shape: CanvasShape }) => void;

  constructor({
    canvas,
    onChange,
    afterNewShape,
    fallbackCanvas,
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
      if (!shape) return;

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
      }
    });

    this.ctx.restore();
  }

  mouse_Down(e: PointerEvent) {
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

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

    cConf.activeShapes.clear(); /* clear actives */

    /* drag shape */
    for (let index = 0; index < this.canvasShapes.length; index++) {
      if (!this.canvasShapes[index]) continue;
      if (getDragShape({ mouseX, mouseY, shape: this.canvasShapes[index] })) {
        this.dragShape = index;
        isResizeorDrag = true;

        /* add to bin */
        Bin.push({
          type: "common",
          shapes: [JSON.parse(JSON.stringify(this.canvasShapes[index]))],
        });

        /* get offset */
        getOffsets({ mouseX, mouseY, shape: this.canvasShapes[index] });

        break;
      }
    }

    if (isResizeorDrag) {
      this.draw();
      return;
    }

    /* start massive selection */
    this.multipleSelection.isSelecting = true;
    this.multipleSelection.x = mouseX;
    this.multipleSelection.y = mouseY;

    this.draw();
  }

  mouse_Move(e: MouseEvent) {
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);
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
        shape: this.newShapeParams,
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

  mouse_Up(e: PointerEvent) {
    const { x: mouseX, y: mouseY } = this.getTransformedMouseCoords(e);

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

      this.findEmptyIndexAndInsert(this.newShapeParams);
      // this.canvasShapes.push(this.newShapeParams);

      /* add to bin */
      Bin.push({ type: "fresh", shapes: [this.newShapeParams] });
      /* update mode after new shape */
      if (this.newShapeParams.type !== "pencil") {
        cConf.currMode = "pointer";
        cConf.activeShapes.set(this.newShapeParams.id, true);
      }

      /* callback after new_shape */
      this.afterNewShape({
        mode: cConf.currMode,
        shape: this.newShapeParams,
      });
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
      shapes: this.canvasShapes,
      currentMode: cConf.currMode,
      activeShapes: cConf.activeShapes,
    });
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

    /* insert test to shape */
    let clickedInsideShape = false;
    for (let index = 0; index < this.canvasShapes.length; index++) {
      if (!this.canvasShapes[index]) continue;

      if (
        addTextToShape({
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
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.key === "d") {
        this.canvasShapes.forEach((shape) => {
          if (!cConf.activeShapes.has(shape.id)) return;

          const s = duplicateShape({ shape });
          if (s) {
            /* delete from actives */
            cConf.activeShapes.delete(shape.id);

            this.findEmptyIndexAndInsert(s);

            /* add to bin */
            Bin.push({ type: "fresh", shapes: [s] });

            // this.canvasShapes.push(s);
            // this.insertShapeGuide({ id: s.id, v: s.props });

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
          const newId = uuidv4();
          c.id = newId;
          c.props.x = this.currentMousePosition.x - c.props.offsetX;
          c.props.y = this.currentMousePosition.y - c.props.offsetY;

          this.findEmptyIndexAndInsert(c);
        });
      } else if (e.key === "z") {
        const shapes: CanvasShape[] = [];
        /* get back from bin */
        const binShapes = Bin.pop();

        if (binShapes) {
          switch (binShapes.type) {
            case "delete":
              /* create the shapes */
              binShapes.shapes.forEach((s) => {
                shapes.push(JSON.parse(JSON.stringify(s)));
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

          /* i dont knowwhat to say */
          Restore.push({ type: binShapes.type, shapes });
        }
      } else if (e.key === "y") {
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

          /* i dont knowwhat to say */
          Bin.push({ type: restore.type, shapes });
        }
      }
    } else if (e.key === "Delete") {
      const toBin: CanvasShape[] = [];

      this.canvasShapes.forEach((s, index) => {
        if (!s) return;
        if (cConf.activeShapes.has(s.id)) {
          cConf.activeShapes.delete(s.id);

          this.shapeGuides.delete(s.id);
          toBin.push(JSON.parse(JSON.stringify(s)));
          // @ts-expect-error //necessary to give null
          this.canvasShapes[index] = null;

          this.emptyIndexes.push(index);
        }
      });

      Bin.push({ type: "delete", shapes: toBin });
    }

    /* change callback */
    this.onChange({
      activeShapes: cConf.activeShapes,
      currentMode: cConf.currMode,
      shapes: this.canvasShapes,
    });
    this.reset();
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

        cConf.activeShapes.set(newText.id, true);
        cConf.currMode = "pointer";

        /* callback after new_shape */
        this.afterNewShape({
          shape: newText,
          mode: cConf.currMode,
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
      const midX = this.canvas.width * 0.5;
      const midY = this.canvas.height * 0.5;

      const xPer = ((x - midX) / midX) * 100;
      const yPer = ((x - midY) / midY) * 100;

      e.preventDefault();
      if (e.deltaY > 0) {
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
    this.draw();
  }

  initialize() {
    this.canvas.addEventListener("pointerdown", this.mouse_Down.bind(this));
    this.canvas.addEventListener("pointermove", this.mouse_Move.bind(this));
    this.canvas.addEventListener("pointerup", this.mouse_Up.bind(this));
    this.canvas.addEventListener("dblclick", this.mouseDblClick.bind(this));
    this.canvas.addEventListener("click", this.mouseClick.bind(this));
    document.addEventListener("keydown", this.documentKeyDown.bind(this));
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.canvas.addEventListener("wheel", this.zoomAndScroll.bind(this));
  }

  cleanup() {
    this.canvas.removeEventListener("pointerdown", this.mouse_Down.bind(this));
    this.canvas.removeEventListener("pointermove", this.mouse_Move.bind(this));
    this.canvas.removeEventListener("pointerup", this.mouse_Up.bind(this));
    this.canvas.removeEventListener("click", this.mouseClick.bind(this));
    this.canvas.removeEventListener("dblclick", this.mouseDblClick.bind(this));
    document.removeEventListener("keydown", this.documentKeyDown.bind(this));
    window.removeEventListener("resize", this.resizeCanvas.bind(this));
    this.canvas.removeEventListener("wheel", this.zoomAndScroll.bind(this));
  }
}

export default CanvasClass;
