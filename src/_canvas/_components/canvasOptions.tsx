import FontSizeoption from "./fontsizeOption";
import CanvasClass from "../canvasClass";
import { cConf } from "../canvasConfig";
import FillOption from "./fillOption";
import { Square, Trash } from "lucide-react";
import TextAlign from "./textalignOption";
import React, {useState} from "react";
import OpacityOptions from "@/_canvas/_components/opacityOptions.tsx";
import LineandradiusOption from "@/_canvas/_components/lineandradiusOption.tsx";

export default function CanvasOptions({
   canvas,
   activesShapes,
}: {
   activesShapes: number;
   canvas: React.MutableRefObject<CanvasClass | null>;
}) {
   const [currentOpac, setCurrentOpac] = useState<0 | 0.5 | 1>(0);

   const handleColor = (color: string) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      const opacity = {
         1 : "ff",
         0.5 : "50",
         0 : "ff"
      }

      const currOpac = opacity[currentOpac]

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            const { props, type } = canvas.current.canvasShapes[i];

            if (
               type === "line" ||
               type === "pencil"
            ) {
               props.stroke = color + currOpac;
            } else if ( type === "text") {
               props.fontColor = color + currOpac;
            } else {
               props.fill = color + currOpac;
            }
         }

         canvas.current.draw();
      }
   };

   const handleStroke = (stroke: number) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.lineWidth = stroke;
         }

         canvas.current.draw();
      }
   };

   const handleColorOpacity = (opacity: 0 | 0.5 | 1) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      // Map opacity to corresponding hex values
      const opacityHex = {
         1: 'ff',
         0.5: '50',
         0: '00',
      } as const;
      const opac = opacityHex[opacity];
      // Process canvas shapes
      if (Array.isArray(canvas.current.canvasShapes)) {
         canvas.current.canvasShapes.forEach((shape) => {
            // Continue only if shape is valid and active
            if (!shape || !cConf.activeShapes.has(shape.id)) return;

            const { type, props } = shape;

            if (type === "line" || type === "pencil") {
               // Ensure stroke is a valid hex color before modifying
               if (props.stroke.length >= 6) {
                  props.stroke = props.stroke.slice(0, 7) + opac; // Adding opacity to hex color
               }
            } else if (type === "text") {
               // If font color is valid hex, update opacity
               if (props.fontColor.length >= 6) {
                  props.fontColor = props.fontColor.slice(0, 7) + opac;
               }
            } else {
               // For other shapes, assume fill color is hex and update
               if (props.fill.length >= 6) {
                  props.fill = props.fill.slice(0, 7) + opac;
               }
            }
         });

         // Redraw the canvas after updating properties
         canvas.current.draw();
      }
   };

   const handleStrokeColor = (color: string) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.stroke = color;
         }

         canvas.current.draw();
      }
   };

   const handleDashed = (v: [number, number]) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.dash = v;
         }

         canvas.current.draw();
      }
   };

   const handleFontSize = (v: number) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.fontSize = v;
         }

         canvas.current.draw();
      }
   };

   const handleRadius = (v: boolean) => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.radius = v ? 10 : 0;
         }

         canvas.current.draw();
      }
   };

   const handleAlign = (side: "left" | "center" | "right") => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (
               !canvas.current.canvasShapes[i] ||
               !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
            )
               continue;

            canvas.current.canvasShapes[i].props.textAlign = side;
         }

         canvas.current.draw();
      }
   };

   const handleIndex = (where: "above" | "bottom") => {
      if (!canvas.current || !canvas.current.canvasShapes) return;

      let index: number | null = null;

      if (Array.isArray(canvas.current.canvasShapes)) {
         for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
            if (!canvas.current.canvasShapes[i]) continue;

            if (cConf.activeShapes.has(canvas.current.canvasShapes[i].id)) {
               index = i;
               break;
            }
         }
         if (index != null) {
            if (where === "above") {
               [
                  canvas.current.canvasShapes[index],
                  canvas.current.canvasShapes[
                     canvas.current.canvasShapes.length - 1
                  ],
               ] = [
                  canvas.current.canvasShapes[
                     canvas.current.canvasShapes.length - 1
                  ],
                  canvas.current.canvasShapes[index],
               ];
            } else {
               [
                  canvas.current.canvasShapes[index],
                  canvas.current.canvasShapes[0],
               ] = [
                  canvas.current.canvasShapes[0],
                  canvas.current.canvasShapes[index],
               ];
            }
            canvas.current.draw();
         }
      }
   };

   return (
      <div className="max-w-[10em] absolute z-[100] top-0 right-0 bg-foreground/5 px-2 py-4 rounded-md flex flex-col gap-3">
            <FillOption handleColor={handleColor} handleStrokeColor={handleStrokeColor}/>

          <div className={"w-full b-1 border border-foreground/10 mt-1 mb-1"}/>

            <OpacityOptions
                setOpac={setCurrentOpac}
                handlecoloropac={handleColorOpacity}
            />
            <LineandradiusOption handleRadius={handleRadius} handleDots={handleDashed} />
            <FontSizeoption handleFontSize={handleFontSize} handleLineWidth={handleStroke}/>
            {/* <Forward /> */}
            {activesShapes > 0 && (
                <div className={"flex flex-col gap-3 px-2"}>
                   <div className={"w-full b-1 border border-foreground/10 mt-1 mb-1"}/>
                   <div className={"flex gap-2"}>
                      <div
                          role="button"
                          onClick={() => handleIndex("bottom")}
                          className="flex relative px-2"
                      >
                         <Square/>
                         <Square className="absolute top-[0.3em] left-3 bg-background"/>
                      </div>
                      <div
                          role="button"
                          onClick={() => handleIndex("above")}
                          className="flex relative px-2"
                      >
                         <Square className="z-20 bg-background"/>
                         <Square className="absolute top-[0.3em] left-[0.3em]"/>
                      </div>

                      <Trash
                          onClick={() => {
                             if (!canvas.current) return;
                             canvas.current.deleteShapes();
                          }}
                      />
                   </div>
                   <TextAlign handleAlign={handleAlign}/>

                   {/*<ConvertShape />*/}
                </div>
            )}
      </div>
   );
}
