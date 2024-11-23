export type shapeType = "rect" | "line" | "ellipse" | "text" | "others";

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
   | "hands_free";

export interface ShapeProps {
   x: number;
   y: number;
   w: number;
   h: number;
   containerId?: string;
   connectedTo: string[];
   radius: number;
   angle: number;

   /* for line */
   startShape?: string | null;
   endSHape?: string | null;
   arrowS?: boolean;
   arrowE?: boolean;

   xRadius?: number;
   yRadius?: number;

   text: string;
   textAlign: "left" | "center" | "right";
   fontSize: number;

   points?: { x: number; y: number }[];

   /* style */
   fill: string;
   stroke: string;
   dash: [number, number];
   lineWidth: number;
}

export interface CanvasShape {
   id: string;
   type: shapeType;
   props: ShapeProps;
}
