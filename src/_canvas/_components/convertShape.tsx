import {
  BombIcon,
  Circle,
  LucideIcon,
  Octagon,
  Square,
  Star,
  Triangle,
} from "lucide-react";
import { shapeType } from "@/_canvas/canvasTypes.ts";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { cConf } from "@/_canvas/canvasConfig.ts";
import CanvasClass from "@/_canvas/canvasClass.ts";

const shapes: {
  label: shapeType;
  Icon: LucideIcon;
  iteration?: number;
  inset?: number;
}[] = [
  { label: "triangle", Icon: Triangle },
  { label: "others", Icon: Octagon, iteration: 8, inset: 1.1 },
  { label: "others", Icon: Star, iteration: 6, inset: 0.58 },
  { label: "others", Icon: BombIcon, iteration: 12, inset: 0.58 },
  { label: "ellipse", Icon: Circle },
  { label: "rect", Icon: Square },
];

const ConvertShape = ({
  canvas,
}: {
  canvas: React.MutableRefObject<CanvasClass | null>;
}) => {
  const handleConvertShape = (
    type: shapeType,
    iteration?: number,
    inset?: number,
  ) => {
    if (!canvas.current || !canvas.current.canvasShapes) return;
    let shape: number | null = null;
    cConf.activeShapes.forEach((_, key) => {
      if (!canvas.current?.canvasShapes.length) return;

      for (let j = 0; j < canvas.current.canvasShapes.length; j++) {
        if (!canvas.current?.canvasShapes[j]) continue;
        if (canvas.current?.canvasShapes[j].id === key) {
          shape = j;
          break;
        }
      }
    });

    if (shape === null) return;
    if (iteration) {
      canvas.current.canvasShapes[shape].type = type;
      canvas.current.canvasShapes[shape].props.xRadius =
        canvas.current.canvasShapes[shape].props.w * 0.5;
      canvas.current.canvasShapes[shape].props.iteration = iteration;
      canvas.current.canvasShapes[shape].props.inset = inset;
      canvas.current.canvasShapes[shape].props.h =
        canvas.current.canvasShapes[shape].props.w;
    } else {
      canvas.current.canvasShapes[shape].type = type;
    }
    canvas.current.draw();
  };

  return (
    <Menubar className={"bg-foreground/5"}>
      <MenubarMenu>
        <MenubarTrigger className={"w-full text-xs flex justify-between"}>
          Shapes <Square />
        </MenubarTrigger>
        <MenubarContent
          side={"left"}
          className={"z-[100] grid grid-cols-3 gap-1 bg-accent"}
        >
          {shapes.map((s, i) => (
            <MenubarItem
              key={i}
              onPointerDown={() =>
                handleConvertShape(s.label, s?.iteration, s?.inset)
              }
              className={"w-8 h-8"}
            >
              <s.Icon key={s.label} />
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default ConvertShape;
