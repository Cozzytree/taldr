import {Circle, SquareDashed, SquareDashedIcon} from "lucide-react";

export default function DashedOption({
   handleDashed,
}: {
   handleDashed: (v: [number, number]) => void;
}) {
   return (
      <div className="flex gap-2">
         <Circle className="w-5 h-5" onClick={() => handleDashed([0, 0])} />
         <SquareDashedIcon
            className="w-5 h-5"
            onClick={() => handleDashed([5, 5])}
         />
         <SquareDashed
            className="w-5 h-5"
            onClick={() => handleDashed([10, 10])}
         />
      </div>
   );
}
