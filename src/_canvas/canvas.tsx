import CanvasOptions from "./_components/canvasOptions";
import { useEffect, useRef, useState } from "react";
import ChangeModes from "./_components/changeModes";
import { CanvasShape, modes } from "./canvasTypes";
import CanvasClass from "./canvasClass";
import { cConf } from "./canvasConfig";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import {
  Circle,
  ContainerIcon,
  Grab,
  Images,
  Link2,
  LucideIcon,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Plus,
  Square,
  Type,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";

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

const Canvas = ({
  userId,
  workspaceId,
  initialShapes,
  isPreview = false,
  handleUpdateShapes,
}: {
  userId?: string;
  isPreview?: boolean;
  workspaceId?: string;
  socketRef?: WebSocket;
  initialShapes?: CanvasShape[] | undefined;
  handleUpdateShapes?: () => (shapes: CanvasShape[]) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<CanvasClass | null>(null);
  const [activeShapes, setActiveShape] = useState(0);
  const [hideUi, setHideui] = useState(false);
  const [mode, setMode] = useState<modes>("pointer");
  const [scale, setScale] = useState(cConf.scale.x);

  useEffect(() => {
    if (!canvasRef.current || !fallbackCanvasRef.current) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    fallbackCanvasRef.current.width = window.innerWidth;
    fallbackCanvasRef.current.height = window.innerHeight;

    const init = new CanvasClass({
      initialShapes,
      isEditable: !isPreview,
      canvas: canvasRef.current,
      fallbackCanvas: fallbackCanvasRef.current,
      onChange: ({ activeShapes, currentMode }) => {
        setActiveShape(activeShapes.size);
        setMode(currentMode);
        setScale(cConf.scale.x);
      },
      updateaftermouseup: ({ shapes }) => {
        if (userId && workspaceId) {
          handleUpdateShapes?.()(shapes);
        } else {
          localStorage.setItem("canvasStore", JSON.stringify(shapes));
        }
      },
    });

    canvas.current = init;
    init.initialize();

    init.draw();

    return () => {
      init.draw();
      init.cleanup(); // Ensure CanvasClass is properly cleaned up
    };
  }, [workspaceId, userId]);

  useEffect(() => {
    const handleChangeMode = (e: KeyboardEvent) => {
      const key = Number(e.key);
      if (isNaN(key)) return;
      if (m[key]) {
        cConf.activeShapes.clear();
        cConf.currMode = m[key].name;
        setMode(m[key].name);
      }
    };
    document.addEventListener("keydown", handleChangeMode);

    return () => {
      document.removeEventListener("keydown", handleChangeMode);
    };
  }, []);

  const handleZoomInOut = (val: number) => {
    if (!canvas.current) return;
    if (val == 1) {
      cConf.scale.x *= 1.1;
      cConf.scale.y *= 1.1;
    } else {
      if (!canvas.current || cConf.scale.x <= 0.6) return;
      cConf.scale.x /= 1.1;
      cConf.scale.y /= 1.1;
    }
    cConf.scale.x = Math.round(cConf.scale.x * 10) / 10;
    cConf.scale.y = Math.round(cConf.scale.y * 10) / 10;
    canvas.current.draw();

    setScale(cConf.scale.x);
  };

  return (
    <div id="canvas-div" className={`relative w-full h-screen`}>
      <main className="w-full h-full">
        {!isPreview && !hideUi && (
          <>
            <ChangeModes
              modes={m}
              canvas={canvas}
              activeShapes={activeShapes}
              currMode={mode}
              changeMode={(mode) => {
                cConf.currMode = mode;
                cConf.activeShapes.clear();
                setMode(mode);
              }}
            />

            <div className="hidden md:flex max-w-[10em] absolute z-[100] top-0 right-0 bg-accent p-2 rounded-md flex-col gap-2">
              <CanvasOptions canvas={canvas} activesShapes={activeShapes} />
            </div>
          </>
        )}

        {!hideUi && (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button
                  className="absolute left-[50%] top-2 z-[100]"
                  variant={"outline"}
                  size={"sm"}
                >
                  {(scale * 100).toFixed(0)} %
                </Button>
              </MenubarTrigger>
              <MenubarContent side="bottom" align="center">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <Button
                    onPointerDown={() => handleZoomInOut(0)}
                    size="sm"
                    variant={"ghost"}
                  >
                    <Minus />
                  </Button>
                  <span className="w-12">{(scale * 100).toFixed(0)} %</span>
                  <Button
                    onPointerDown={() => handleZoomInOut(1)}
                    size="sm"
                    variant={"ghost"}
                  >
                    <Plus />
                  </Button>
                </div>
                <MenubarItem
                  onPointerDown={() => {
                    if (!canvas.current) return;
                    if (cConf.offset.x !== 0 || cConf.offset.y !== 0) {
                      cConf.offset = { x: 0, y: 0 };
                      canvas.current.draw();
                    }
                  }}
                >
                  Center canvas
                </MenubarItem>
                {workspaceId !== undefined && userId !== undefined && (
                  <MenubarItem
                    onPointerDown={() => {
                      const link =
                        import.meta.env.VITE_MODE === "development"
                          ? `http://localhost:5173/preview/${workspaceId}`
                          : `https://taldr.netlify.app/preview/${workspaceId}`;

                      navigator.clipboard
                        .writeText(link)
                        .then(() => {
                          toast.success("copied");
                        })
                        .catch((err) => {
                          toast.error(
                            "error while copying link : ",
                            err.message,
                          );
                        });
                    }}
                  >
                    <Link2 /> copy link
                  </MenubarItem>
                )}
                {!isPreview && (
                  <MenubarItem
                    onPointerDown={() => {
                      setHideui(true);
                    }}
                  >
                    Hide ui
                  </MenubarItem>
                )}

                <MenubarItem
                  onClick={() => {
                    if (!canvas.current) return;
                    const newCanvas = document.createElement("canvas");
                    newCanvas.width = canvas.current.canvas.width;
                    newCanvas.height = canvas.current.canvas.height;
                    const newCtx = newCanvas.getContext("2d");
                    if (!newCtx) {
                      toast.error("error while converting to image");
                      return;
                    }
                    newCtx.fillStyle = "#202020";
                    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
                    newCtx.drawImage(canvas.current.canvas, 0, 0);
                    newCanvas.style.background = "#202020";

                    const c = newCanvas.toDataURL("image/png", 100);
                    const l = document.createElement("a");
                    l.href = c;
                    l.download = "canvasimage.png";
                    l.click();
                  }}
                >
                  Save as Image
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
        {hideUi && (
          <Button
            onPointerDown={() => setHideui(false)}
            size={"icon"}
            variant={"outline"}
            className="fixed bottom-4 right-3 z-[100]"
          >
            <Unlock />
          </Button>
        )}

        <canvas
          className="absolute top-0 touch-auto left-0 bg-background transition-all duration-200"
          ref={fallbackCanvasRef}
        ></canvas>
        <canvas
          className="absolute top-0 left-0 z-50 touch-auto transition-all duration-200"
          ref={canvasRef}
        ></canvas>
      </main>
    </div>
  );
};

export default Canvas;
