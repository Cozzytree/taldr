import {
  BombIcon,
  Circle,
  Diamond,
  Fan,
  LucideIcon,
  Octagon,
  // Pentagon,
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
  shouldAddarc?: boolean;
}[] = [
  { label: "triangle", Icon: Triangle },
  {
    label: "others",
    Icon: Octagon,
    iteration: 8,
    inset: 1.1,
    shouldAddarc: false,
  },
  {
    label: "others",
    Icon: Star,
    iteration: 6,
    inset: 0.58,
    shouldAddarc: false,
  },
  {
    label: "others",
    Icon: BombIcon,
    iteration: 12,
    inset: 0.58,
    shouldAddarc: false,
  },
  {
    label: "others",
    Icon: Diamond,
    iteration: 2,
    inset: 1,
    shouldAddarc: false,
  },
  { label: "ellipse", Icon: Circle },
  { label: "rect", Icon: Square },
  { label: "others", Icon: Fan, iteration: 6, inset: 0.6, shouldAddarc: true },
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
    shouldAddarc?: boolean,
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

      if (shouldAddarc === true) {
        canvas.current.canvasShapes[shape].props.shouldAddarc = true;
      } else if (shouldAddarc === false) {
        canvas.current.canvasShapes[shape].props.shouldAddarc = false;
      }

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
                handleConvertShape(
                  s.label,
                  s?.iteration,
                  s?.inset,
                  s?.shouldAddarc,
                )
              }
              className={"w-8 h-8"}
            >
              <s.Icon key={s.label} />
            </MenubarItem>
          ))}
          <MenubarItem>
            <svg
              width="28px"
              height="28px"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path
                d="M41.2796 8H15.4704C14.5956 8 13.8223 8.5685 13.5614 9.40345L4.81142 37.4035C4.40897 38.6913 5.3711 40 6.72038 40H32.5296C33.4044 40 34.1777 39.4315 34.4386 38.5965L43.1886 10.5965C43.591 9.30869 42.6289 8 41.2796 8Z"
                stroke="white"
                strokeWidth={4}
              />
            </svg>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default ConvertShape;
