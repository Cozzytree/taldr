import {
   MenubarContent,
   MenubarMenu,
   MenubarTrigger,
} from "@/components/ui/menubar";
import { Square } from "lucide-react";
import { colors } from "../utils";

export default function FillOption({
   handleColor,
}: {
   handleColor: (v: string) => void;
}) {
   return (
      <MenubarMenu>
         <MenubarTrigger>
            <Square />
         </MenubarTrigger>
         <MenubarContent
            className="grid grid-cols-4 gap-1 w-fit"
            side="top"
            align="center"
         >
            {colors.map((c) => (
               <button
                  onClick={() => handleColor(c)}
                  key={c}
                  style={{ background: c }}
                  className={`bg-[${c}] h-7 w-7 rounded-md`}
               />
            ))}
         </MenubarContent>
      </MenubarMenu>
   );
}
