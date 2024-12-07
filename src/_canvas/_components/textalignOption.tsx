import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export default function TextAlign({
  handleAlign,
}: {
  handleAlign: (side: "left" | "center" | "right") => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2">
      <AlignLeft
        onPointerDown={() => handleAlign("left")}
        className="w-8 h-8 cursor-pointer hover:bg-foreground/10 bg-foreground/5 rounded-sm px-2 py-1"
      />
      <AlignCenter
        onPointerDown={() => handleAlign("center")}
        className="w-8 h-8 cursor-pointer hover:bg-foreground/10 bg-foreground/5 rounded-sm px-2 py-1"
      />
      <AlignRight
        onPointerDown={() => handleAlign("right")}
        className="w-8 h-8 cursor-pointer hover:bg-foreground/10 bg-foreground/5 rounded-sm px-2 py-1"
      />
    </div>
  );
}
