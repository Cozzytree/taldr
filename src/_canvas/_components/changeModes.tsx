import CanvasOptions from "@/_canvas/_components/canvasOptions.tsx";
import CanvasClass from "@/_canvas/canvasClass.ts";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { cn } from "@/lib/utils";
import { ArrowBigUpDash, LucideIcon, Redo, Undo } from "lucide-react";
import { MutableRefObject } from "react";
import { cConf } from "../canvasConfig";
import { modes } from "../canvasTypes";

const ChangeModes = ({
  modes,
  canvas,
  currMode,
  changeMode,
  activeShapes,
}: {
  modes: {
    icon: LucideIcon;
    name: modes;
  }[];
  currMode: modes;
  activeShapes: number;
  changeMode: (mode: modes) => void;
  canvas: MutableRefObject<CanvasClass | null>;
}) => {
  const handleImage = (img: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the canvas size to match the image size
        canvas.width = imgElement.width * 0.7;
        canvas.height = imgElement.height * 0.7;

        // Draw the image onto the canvas
        ctx?.drawImage(
          imgElement,
          0,
          0,
          imgElement.width * 0.7,
          imgElement.height * 0.7,
        );

        // Export the image at a lower quality (e.g., 0.5 means 50% quality)
        const quality = 0.5; // You can adjust this value (0.0 - 1.0)
        const reducedQualityImage = canvas.toDataURL("image/jpeg", quality);

        // You can now use the reduced quality image as needed
        const finaleImage = new Image();

        finaleImage.onload = () => {
          cConf.image = finaleImage.src;
        };
        finaleImage.src = reducedQualityImage;
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(img);
  };

  return (
    <>
      <div className="absolute bottom-16 sm:bottom-12 left-[50%] z-[100] translate-x-[-50%] flex items-center divide-x-2 border border-accent">
        {modes.map((mode, i) => (
          <div key={i}>
            {mode.name === "image" ? (
              <>
                <label
                  onPointerDown={() => changeMode(mode.name)}
                  onClick={() => changeMode(mode.name)}
                  onTouchStart={() => changeMode(mode.name)}
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "sm",
                    }),
                    "w-6 h-6 p-2 sm:w-8 sm:h-8 dm:px-[1.3em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground relative",
                    currMode === mode.name
                      ? "bg-foreground"
                      : "bg-background text-foreground",
                  )}
                  htmlFor="image"
                >
                  <mode.icon />
                  <span className="text-xs hidden sm:block absolute bottom-0 right-1">
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
                onPointerDown={() => {
                  changeMode(mode.name);
                }}
                size="lg"
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 p-2 sm:px-[1.3em] focus:outline-0 outline-0 hover:bg-foreground/10 hover:text-foreground relative rounded-none",
                  currMode === mode.name
                    ? "bg-foreground"
                    : "bg-background text-foreground",
                )}
              >
                <mode.icon />
                <span className="text-xs hidden sm:block absolute bottom-0 right-1">
                  {i}
                </span>
              </Button>
            )}
          </div>
        ))}

        <div className="w-full flex md:hidden items-center justify-start gap-2 px-2">
          <Button
            onPointerDown={() => {
              if (!canvas.current) return;
              canvas.current.undo();
            }}
            variant={"ghost"}
            size={"icon"}
            className="border border-accent"
          >
            <Undo />
          </Button>
          <Button
            onPointerDown={() => {
              if (!canvas.current) return;
              canvas.current.redo();
            }}
            variant={"ghost"}
            size={"icon"}
            className="border border-accent"
          >
            <Redo />
          </Button>
        </div>

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
                  "bg-foreground/5 flex flex-col gap-2 p-1 max-w-[10em] z-[999]"
                }
              >
                <CanvasOptions activesShapes={activeShapes} canvas={canvas} />
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </>
  );
};

export default ChangeModes;
