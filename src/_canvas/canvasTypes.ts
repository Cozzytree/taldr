export type shapeType =
   | "rect"
   | "line"
   | "ellipse"
   | "text"
   | "pencil"
   | "others"
   | "figure"
   | "image"
   | "triangle"
   | "path";

export type ResizeDirection =
   | "left-edge"
   | "right-edge"
   | "top-edge"
   | "bottom-edge"
   | "top-left"
   | "bottom-left"
   | "top-right"
   | "bottom-right";

export type modes =
   | "pointer"
   | "pencil"
   | "text"
   | "line"
   | "rect"
   | "ellipse"
   | "hands_free"
   | "image"
   | "figure";

export interface connectionInterface {
   xPer: number;
   yPer: number;
   shapeId: string;
   followPoint: { x: number; y: number };
}

export interface ShapeProps {
   x: number;
   y: number;
   w: number;
   h: number;
   containerId?: string;
   connectedTo: string[];
   radius: number;
   angle: number;

   name?: string;

   /* for line */
   startShape?: connectionInterface | null;
   endShape?: connectionInterface | null;
   arrowS?: boolean;
   arrowE?: boolean;

   xRadius?: number;
   yRadius?: number;

   text: string;
   textAlign: "left" | "center" | "right";
   fontSize: number;

   points?: { x: number; y: number; offsetX: number; offsetY: number }[];

   /* style */
   fill: string;
   stroke: string;
   dash: [number, number];
   lineWidth: number;
   fontColor: string;

   offsetX: number;
   offsetY: number;

   iteration?: number;
   inset?: number;

   image?: CanvasImageSource;
}

export interface CanvasShape {
   id: string;
   type: shapeType;
   props: ShapeProps;
}
