import { CanvasShape } from "./canvasTypes";

type redoUndoType = "delete" | "fresh" | "common";

class Stack {
   store: { type: redoUndoType; shapes: CanvasShape[] }[];
   constructor() {
      this.store = [];
   }

   push(val: { type: redoUndoType; shapes: CanvasShape[] }) {
      if (this.store.length >= 500) return;
      this.store.push(val);
   }

   pop() {
      if (!this.store.length) return;
      return this.store.pop();
   }
}

const Bin = new Stack();
const Restore = new Stack();

export { Bin, Restore };
