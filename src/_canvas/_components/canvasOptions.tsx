import { Menubar } from "@/components/ui/menubar";
import FontSizeoption from "./fontsizeOption";
import Stroke_Option from "./strokeOption";
import DashedOption from "./dashedOption";
import RadiusOption from "./radiusOption";
import CanvasClass from "../canvasClass";
import { cConf } from "../canvasConfig";
import FillOption from "./fillOption";
import { Square } from "lucide-react";
import TextAlign from "./textalignOption";

export default function CanvasOptions({
  canvas,
  activesShapes,
}: {
  activesShapes: number;
  canvas: React.MutableRefObject<CanvasClass | null>;
}) {
  const handleColor = (color: string) => {
    if (!canvas.current || !canvas.current.canvasShapes) return;

    if (Array.isArray(canvas.current.canvasShapes)) {
      for (let i = 0; i < canvas.current.canvasShapes.length; i++) {
        if (
          !canvas.current.canvasShapes[i] ||
          !cConf.activeShapes.has(canvas.current.canvasShapes[i].id)
        )
          continue;

        if (
          canvas.current.canvasShapes[i].type === "line" ||
          canvas.current.canvasShapes[i].type === "pencil"
        ) {
          canvas.current.canvasShapes[i].props.stroke = color;
        } else if (canvas.current.canvasShapes[i].type === "text") {
          canvas.current.canvasShapes[i].props.fontColor = color;
        } else {
          canvas.current.canvasShapes[i].props.fill = color;
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

        canvas.current.canvasShapes[i].props.radius = v ? 8 : 0;
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
            canvas.current.canvasShapes[canvas.current.canvasShapes.length - 1],
          ] = [
            canvas.current.canvasShapes[canvas.current.canvasShapes.length - 1],
            canvas.current.canvasShapes[index],
          ];
        } else {
          [canvas.current.canvasShapes[index], canvas.current.canvasShapes[0]] =
            [
              canvas.current.canvasShapes[0],
              canvas.current.canvasShapes[index],
            ];
        }
        canvas.current.draw();
      }
    }
  };

  return (
    <div className="absolute z-[100] bottom-20 w-full flex flex-col items-center justify-center">
      <Menubar>
        <FillOption handleColor={handleColor} />
        <Stroke_Option
          handleStroke={handleStroke}
          handleStrokeColor={handleStrokeColor}
        />
        {/* {activesShapes <= 1 && <DashedOption handleDashed={handleDashed} />} */}
        <DashedOption handleDashed={handleDashed} />
        <FontSizeoption handleFontSize={handleFontSize} />
        <RadiusOption handleRadius={handleRadius} />
        {/* <Forward /> */}
        {activesShapes > 0 && (
          <>
            <div
              role="button"
              onClick={() => handleIndex("bottom")}
              className="flex relative px-2"
            >
              <Square />
              <Square className="absolute top-[0.3em] left-3 bg-background" />
            </div>
            <div
              role="button"
              onClick={() => handleIndex("above")}
              className="flex relative px-2"
            >
              <Square className="z-20 bg-background" />
              <Square className="absolute top-[0.3em] left-[0.3em]" />
            </div>
          </>
        )}
      </Menubar>

      {activesShapes === 1 && <TextAlign handleAlign={handleAlign} />}
    </div>
  );
}
