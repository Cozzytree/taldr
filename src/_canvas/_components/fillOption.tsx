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
            className={`bg-[${c}] h-5 w-5 rounded-sm`}
          />
        ))}

        <label
          htmlFor="custom-color"
          className="h-5 w-5 rounded-sm bg-gradient-to-r from-red-700 to-green-600"
        />
        <input
          onChange={(e) => {
            handleColor(e.target.value);
          }}
          className="hidden"
          type="color"
          id="custom-color"
        />
      </MenubarContent>
    </MenubarMenu>
  );
}
