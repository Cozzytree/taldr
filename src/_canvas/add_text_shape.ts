import { CanvasShape } from "./canvasTypes";
import { createNewText } from "./newShape";
import { isInside } from "./utils";

const addTextToShape = ({
   fn,
   shape,
   mouseX,
   mouseY,
   canvasOffsetX,
   canvasOffsetY,
}: {
   canvasOffsetX: number;
   canvasOffsetY: number;
   mouseX: number;
   mouseY: number;
   shape: CanvasShape;
   fn: (text: string) => void;
}) => {
   if (
      isInside({
         inner: { x: mouseX, y: mouseY, w: 0, h: 0 },
         outer: {
            x: shape.props.x,
            y: shape.props.y,
            w: shape.props.w,
            h: shape.props.h,
         },
      })
   ) {
      createNewText({
         blurEvent: ({ text }) => {
            fn(text);
         },
         text: shape.props.text,
         width: shape.props.w,
         height: shape.props.h,
         mouseX: shape.props.x + canvasOffsetX,
         mouseY: shape.props.y + canvasOffsetY,
         fSize: shape.props.fontSize,
      });
      return true;
   }
};

export { addTextToShape };
