import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Square } from "lucide-react";

export default function RadiusOption({
  handleRadius,
}: {
  handleRadius: (v: boolean) => void;
}) {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        <Square />
      </MenubarTrigger>
      <MenubarContent
        side="top"
        align="center"
        className="flex gap-2 items-center"
      >
        <div
          onClick={() => handleRadius(true)}
          className="w-5 h-5 rounded-md border-2 border-foreground"
        />
        <div
          onClick={() => handleRadius(false)}
          className="w-5 h-5 rounded-none border-2 border-foreground"
        />
      </MenubarContent>
    </MenubarMenu>
  );
}
