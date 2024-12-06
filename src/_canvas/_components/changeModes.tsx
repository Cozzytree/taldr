import {
   MousePointer2,
   Type,
   Grab,
   LucideIcon,
   Pencil,
   Square,
   MoveRight,
   Circle,
   ContainerIcon,
   ArrowBigUpDash,
   Images,
} from "lucide-react";
import { modes } from "../canvasTypes";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import CanvasClass from "@/_canvas/canvasClass.ts";
import CanvasOptions from "@/_canvas/_components/canvasOptions.tsx";
import {
   Menubar,
   MenubarContent,
   MenubarMenu,
   MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { MutableRefObject, useEffect } from "react";
import { cConf } from "../canvasConfig";

const m: { icon: LucideIcon; name: modes }[] = [
   {
      icon: Grab,
      name: "hands_free",
   },
   {
      icon: MousePointer2,
      name: "pointer",
   },
   {
      icon: Square,
      name: "rect",
   },
   {
      icon: Circle,
      name: "ellipse",
   },
   {
      icon: MoveRight,
      name: "line",
   },
   {
      icon: Pencil,
      name: "pencil",
   },
   {
      icon: Type,
      name: "text",
   },
   {
      icon: Images,
      name: "image",
   },
   {
      icon: ContainerIcon,
      name: "figure",
   },
];

const ChangeModes = ({
   canvas,
   currMode,
   changeMode,
   activeShapes,
}: {
   currMode: modes;
   activeShapes: number;
   changeMode: (mode: modes) => void;
   canvas: MutableRefObject<CanvasClass | null>;
}) => {
   useEffect(() => {
      const handleChangeMode = (e: KeyboardEvent) => {
         const key = Number(e.key);
         if (isNaN(key)) return;
         if (m[key]) {
            changeMode(m[key].name);
         }
      };
      document.addEventListener("keydown", handleChangeMode);

      return () => {
         document.removeEventListener("keydown", handleChangeMode);
      };
   }, []);

   const handleImage = (img: File) => {
      const reader = new FileReader();

      reader.onload = (e) => {
         const imgElement = new Image();
         imgElement.onload = () => {
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set the canvas size to match the image size
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            // Draw the image onto the canvas
            ctx?.drawImage(
               imgElement,
               0,
               0,
               imgElement.width,
               imgElement.height,
            );

            // Export the image at a lower quality (e.g., 0.5 means 50% quality)
            const quality = 0.5; // You can adjust this value (0.0 - 1.0)
            const reducedQualityImage = canvas.toDataURL("image/jpeg", quality);

            // You can now use the reduced quality image as needed
            const finaleImage = new Image();

            finaleImage.onload = () => {
               cConf.image = finaleImage;
            };
            finaleImage.src = reducedQualityImage;
         };
         imgElement.src = e.target?.result as string;
      };
      reader.readAsDataURL(img);
   };

   return (
      <div className="w-full flex justify-center absolute bottom-16 z-[100]">
         <div className="flex items-center">
            {m.map((mode, i) => (
               <>
                  {mode.name === "image" ? (
                     <>
                        <label
                           onClick={() => changeMode(mode.name)}
                           className={cn(
                              buttonVariants({
                                 variant: "default",
                                 size: "sm",
                              }),
                              "sm:w-8 sm:h-8 h-fit px-[1.3em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground relative",
                              currMode === mode.name
                                 ? "bg-foreground"
                                 : "bg-background text-foreground",
                           )}
                           htmlFor="image"
                        >
                           <mode.icon />
                           <span className="text-xs absolute bottom-0 right-1">
                              {i}
                           </span>
                        </label>
                        <input
                           onChange={(e) => {
                              if (!e.target.files) return;
                              handleImage(e.target.files[0]);
                           }}
                           id="image"
                           type="file"
                           className="hidden"
                           accept=".jpg,.png,.svg,image/jpeg,image/png,image/svg"
                        />
                     </>
                  ) : (
                     <Button
                        onClick={() => changeMode(mode.name)}
                        key={mode.name}
                        size="lg"
                        className={cn(
                           "sm:w-8 sm:h-8 h-fit px-[1.3em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground relative",
                           currMode === mode.name
                              ? "bg-foreground"
                              : "bg-background text-foreground",
                        )}
                     >
                        <mode.icon />
                        <span className="text-xs absolute bottom-0 right-1">
                           {i}
                        </span>
                     </Button>
                  )}
               </>
            ))}

            <div className={"md:hidden"}>
               <Menubar>
                  <MenubarMenu>
                     <MenubarTrigger asChild>
                        <Button
                           variant={null}
                           size={"sm"}
                           className={
                              "sm:w-8 sm:h-8 w-fit h-fit p-[0.5em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground"
                           }
                        >
                           <ArrowBigUpDash />
                        </Button>
                     </MenubarTrigger>
                     <MenubarContent
                        className={
                           "bg-foreground/5 flex flex-col gap-2 p-2 max-w-[10em]"
                        }
                     >
                        <CanvasOptions
                           activesShapes={activeShapes}
                           canvas={canvas}
                        />
                     </MenubarContent>
                  </MenubarMenu>
               </Menubar>
            </div>
         </div>
      </div>
   );
};

export default ChangeModes;
