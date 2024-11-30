import {
  MousePointer2,
  Type,
  Grab,
  LucideIcon,
  Pencil,
  Square,
  MoveRight,
  Circle,
  ContainerIcon,
} from "lucide-react";
import { modes } from "../canvasTypes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const m: { icon: LucideIcon; name: modes }[] = [
  {
    icon: Grab,
    name: "hands_free",
  },
  {
    icon: MousePointer2,
    name: "pointer",
  },
  {
    icon: Square,
    name: "rect",
  },
  {
    icon: Circle,
    name: "ellipse",
  },
  {
    icon: MoveRight,
    name: "line",
  },
  {
    icon: Pencil,
    name: "pencil",
  },
  {
    icon: Type,
    name: "text",
  },
  {
    icon: ContainerIcon,
    name: "figure",
  },
];

const ChangeModes = ({
  changeMode,
  currMode,
}: {
  changeMode: (mode: modes) => void;
  currMode: modes;
}) => {
  return (
    <div className="absolute top-7 left-5 z-[100] flex flex-col rounded-sm">
      {m.map((mode) => (
        <Button
          onClick={() => changeMode(mode.name)}
          key={mode.name}
          size="sm"
          className={cn(
            " w-8 h-8 focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground",
            currMode === mode.name
              ? "bg-foreground"
              : "bg-background text-foreground",
          )}
        >
          <mode.icon />
        </Button>
      ))}
    </div>
  );
};

export default ChangeModes;
