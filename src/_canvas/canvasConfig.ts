import {fontWeights, modes} from "./canvasTypes";

export const cConf: {
   currMode: modes;
   image: string | null;
   activeShapes: Map<string, boolean>;
   scale: { x: number; y: number };
   offset: { x: number; y: number };
} = {
   image: null,
   currMode: "pointer",
   scale: { x: 1, y: 1 },
   offset: { x: 0, y: 0 },
   activeShapes: new Map(),
};

class DefaultShape {
   fill: string;
   stroke: string;
   dash: [number, number];
   lineWidth: number;
   x: number;
   y: number;
   w: number;
   h: number;
   offsetX: number;
   offsetY: number;
   connectedTo: string[] = [];
   radius: number;
   fontColor: string;
   fontWeight : fontWeights;

   text: string;
   textAlign: "left" | "center" | "right";
   fontSize: number;
   angle: number;

   constructor({ x, y }: { x: number; y: number }) {
      this.x = x;
      this.y = y;
      this.w = 0;
      this.h = 0;
      this.text = "";
      this.dash = [0, 0];
      this.fontSize = 20;
      this.connectedTo = [];
      this.lineWidth = 2;
      this.textAlign = "center";
      this.fill = "#00000000";
      this.stroke = "#ffffff";
      this.radius = 8;
      this.angle = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.fontColor = "#ffffff";
      this.fontWeight = "bold";
   }
}

export default DefaultShape;
