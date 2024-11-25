import {
   MenubarContent,
   MenubarMenu,
   MenubarSub,
   MenubarSubContent,
   MenubarSubTrigger,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { Minus } from "lucide-react";
import { colors } from "../utils";

export default function Stroke_Option({
   handleStroke,
   handleStrokeColor,
}: {
   handleStroke: (i: number) => void;
   handleStrokeColor: (c: string) => void;
}) {
   return (
      <MenubarMenu>
         <MenubarTrigger>
            <Minus />
         </MenubarTrigger>
         <MenubarContent side="top" align="center" className="flex flex-col">
            <MenubarSub>
               <MenubarSubTrigger>color</MenubarSubTrigger>
               <MenubarSubContent
                  className="grid grid-cols-4 gap-1"
                  sideOffset={10}
               >
                  {colors.map((c) => (
                     <button
                        onClick={() => handleStrokeColor(c)}
                        key={c}
                        style={{ background: c }}
                        className={`bg-[${c}] h-6 w-6 rounded-sm`}
                     />
                  ))}
               </MenubarSubContent>
            </MenubarSub>

            {Array.from({ length: 5 }).map((_, i) => (
               <div
                  role="button"
                  onClick={() => handleStroke(i + 1)}
                  key={i}
                  className="w-24 hover:bg-foreground/5 px-2 h-6 flex justify-center items-center"
               >
                  <span
                     className="w-full"
                     style={{ border: `${i + 1}px solid white`, height: "2px" }}
                  />
               </div>
            ))}
         </MenubarContent>
      </MenubarMenu>
   );
}
