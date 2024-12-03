export default function RadiusOption({
   handleRadius,
}: {
   handleRadius: (v: boolean) => void;
}) {
   return (
      <div className="flex gap-2 items-center">
         <button
             size={"sm"}
             variant={"ghost"}
            onClick={() => handleRadius(true)}
            className="rounded-md border-2 border-foreground w-5 h-5"
         />
         <button
             size={"sm"}
             variant={"ghost"}
            onClick={() => handleRadius(false)}
            className="rounded-none border-2 border-foreground w-5 h-5"
         />
      </div>
   );
}
