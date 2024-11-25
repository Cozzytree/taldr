import {
   MenubarContent,
   MenubarMenu,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { Square, SquareDashed } from "lucide-react";

export default function DashedOption({
   handleDashed,
}: {
   handleDashed: (v: [number, number]) => void;
}) {
   return (
      <MenubarMenu>
         <MenubarTrigger>
            <SquareDashed />
         </MenubarTrigger>
         <MenubarContent className="flex gap-3" side="top" align="center">
            <Square className="w-6 h-6" onClick={() => handleDashed([0, 0])} />
            <SquareDashed
               className="w-6 h-6"
               onClick={() => handleDashed([5, 5])}
            />
         </MenubarContent>
      </MenubarMenu>
   );
}
