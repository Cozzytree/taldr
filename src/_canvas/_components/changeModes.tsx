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
   ArrowBigUpDash,
} from "lucide-react";
import { modes } from "../canvasTypes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CanvasClass from "@/_canvas/canvasClass.ts";
import CanvasOptions from "@/_canvas/_components/canvasOptions.tsx";
import {Menubar, MenubarContent, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {MutableRefObject} from "react";

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
   canvas,
   currMode,
   changeMode,
   activeShapes
}: {
   currMode: modes;
   activeShapes : number
   changeMode: (mode: modes) => void;
   canvas : MutableRefObject<CanvasClass | null>
}) => {
   return (
      <div className="w-full flex justify-center absolute bottom-16 z-[100]">
         <div className="flex items-center">
            {m.map((mode) => (
               <Button
                  onClick={() => changeMode(mode.name)}
                  key={mode.name}
                  size="sm"
                  className={cn(
                     "w-6 h-6 sm:w-8 sm:h-8 w-fit h-fit p-[0.5em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground",
                     currMode === mode.name
                        ? "bg-foreground"
                        : "bg-background text-foreground",
                  )}
               >
                  <mode.icon />
               </Button>
            ))}

            <div className={"md:hidden"}>
               <Menubar>
                  <MenubarMenu>
                     <MenubarTrigger asChild>
                        <Button variant={null} size={"sm"} className={"w-6 h-6 sm:w-8 sm:h-8 w-fit h-fit p-[0.5em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground"}>
                           <ArrowBigUpDash/>
                        </Button>
                     </MenubarTrigger>
                     <MenubarContent className={"bg-foreground/5 flex flex-col gap-2 p-2 max-w-[10em]"}>
                        <CanvasOptions activesShapes={activeShapes} canvas={canvas} />
                     </MenubarContent>
                  </MenubarMenu>
               </Menubar>
            </div>

         </div>
      </div>
   );
};

export default ChangeModes;
