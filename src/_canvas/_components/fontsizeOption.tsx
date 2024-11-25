import {
   MenubarContent,
   MenubarMenu,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { ALargeSmall } from "lucide-react";
import { fontSizes } from "../utils";

export default function FontSizeoption({
   handleFontSize,
}: {
   handleFontSize: (v: number) => void;
}) {
   return (
      <MenubarMenu>
         <MenubarTrigger>
            <ALargeSmall />
         </MenubarTrigger>
         <MenubarContent align="center" side="top" className="flex flex-col">
            {fontSizes.map((s) => (
               <button
                  onClick={() => handleFontSize(s.size)}
                  key={s.size}
                  className="text-sm font-semibold px-2 py-1 hover:bg-foreground/5 transition-[background] duration-100"
               >
                  {s.label}
               </button>
            ))}
         </MenubarContent>
      </MenubarMenu>
   );
}
