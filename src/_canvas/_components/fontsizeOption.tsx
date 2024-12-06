import { fontSizes } from "../utils";
import {fontWeights} from "@/_canvas/canvasTypes.ts";

export default function FontSizeoption({
   handleFontSize,
   handleLineWidth,
   handleFontWeight,
}: {
   handleFontWeight : (v : fontWeights) => void
   handleLineWidth: (stroke : number) => void;
   handleFontSize: (v: number) => void;
}) {
   return (
      <div className="grid grid-cols-4 gap-2 w-fit place-items-center">
         {fontSizes.map((s) => (
            <button
               onClick={() => {
                  handleFontSize(s.size)
                  handleFontWeight(s.weight as fontWeights)
                  handleLineWidth(s.lineWidth)
               }}
               key={s.size}
               className="text-md font-semibold px-2 py-1 hover:bg-foreground/5 transition-[background] duration-100 text-center"
            >
               {s.label}
            </button>
         ))}
      </div>
   );
}
