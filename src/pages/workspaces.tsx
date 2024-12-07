import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { EllipsisVertical, LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "convex/_generated/dataModel";
import { Timeout } from "node_modules/@tanstack/react-router/dist/esm/utils";

export default function Workspaces() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user, isLoaded } = useUser();
  const workspaces = useQuery(api.workspaces.getuserWorkspaces, {
    userId: user?.id || "",
  });
  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  const deleteWorkspace = useMutation(api.workspaces.deleteWorkspace);
  const updateWorkspaceName = useMutation(api.workspaces.updateWorkspaceName);
  const updateWorkspaceDescription = useMutation(
    api.workspaces.updateWorkspaceDescription,
  );

  useEffect(() => {}, [user]);

  if (!workspaces || !isLoaded) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isLoaded && !user?.id && !workspaces) {
    navigate({ to: "/" });
  }

  const handleCreateWorkspace = async () => {
    if (!user?.id) return;
    await createWorkspace({ name, description, userId: user?.id })
      .then(() => {
        toast.success("successfully deleted");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleDeleteWorkspace = async (id: Id<"workspaces">) => {
    if (!user?.id) return;
    await deleteWorkspace({ id, userId: user.id })
      .then(() => {
        toast.success("successfully deleted");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleUpdateName = () => {
    let timer: Timeout;
    return async (name: string, id: Id<"workspaces">) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(async () => {
        if (!user?.id) return;
        await updateWorkspaceName({ userId: user.id, id, name });
      }, 200);
    };
  };

  const handleUpdateDescription = () => {
    let timer: Timeout;
    return async (description: string, id: Id<"workspaces">) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        if (!user?.id) return;
        await updateWorkspaceDescription({ description, userId: user.id, id });
      }, 200);
    };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-10 justify-start">
      <div className="w-full py-4 flex justify-between items-center px-3 sm:px-10">
        <h1 className="text-xl font-semibold text-start w-full">Workspaces</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} variant={"outline"}>
                Create workspace <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Workspace</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Name..."
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Description..."
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button onClick={handleCreateWorkspace}>Save</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:container mb-10">
        {!workspaces.length ? (
          <div className="w-full flex justify-center text-sm">Empty</div>
        ) : (
          workspaces.map((w, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-full flex items-center justify-between">
                  <Link
                    className={`${buttonVariants({ variant: "link", size: "sm" })} text-[1em]`}
                    href={`/workspace/${w._id}`}
                  >
                    {w.name}
                  </Link>

                  <AlertDialog>
                    <Dialog>
                      <Menubar>
                        <MenubarMenu>
                          <MenubarTrigger asChild>
                            <button>
                              <EllipsisVertical />
                            </button>
                          </MenubarTrigger>
                          <MenubarContent>
                            <AlertDialogTrigger asChild>
                              <MenubarItem>Delete</MenubarItem>
                            </AlertDialogTrigger>
                            <DialogTrigger>
                              <MenubarItem>Update</MenubarItem>
                            </DialogTrigger>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>

                      <UpdateDetails
                        n={w.name}
                        id={w._id}
                        key={w._id}
                        d={w.description}
                        handleUpdateName={handleUpdateName}
                        handleUpdateDescription={handleUpdateDescription}
                      />
                    </Dialog>

                    <AlertDialogContent>
                      <AlertDialogTitle>
                        Are you sure you want to delete?
                      </AlertDialogTitle>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
                        >
                          cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteWorkspace(w._id)}
                          className={`${buttonVariants({ variant: "destructive", size: "sm" })}`}
                        >
                          confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="text-foreground/60 text-sm">
                {w.description}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

const UpdateDetails = ({
  n,
  d,
  id,
  handleUpdateName,
  handleUpdateDescription,
}: {
  n: string;
  d: string;
  id: Id<"workspaces">;
  handleUpdateName: () => (name: string, id: Id<"workspaces">) => Promise<void>;
  handleUpdateDescription: () => (
    description: string,
    id: Id<"workspaces">,
  ) => Promise<void>;
}) => {
  return (
    <>
      <DialogContent>
        <DialogTitle>Update</DialogTitle>
        <DialogDescription className="space-y-3">
          <Input
            defaultValue={n}
            type="text"
            onChange={(e) => {
              handleUpdateName()(e.target.value, id);
            }}
            className="text-foreground"
          />
          <Input
            defaultValue={d}
            placeholder="description"
            type="text"
            onChange={(e) => handleUpdateDescription()(e.target.value, id)}
          />
        </DialogDescription>
      </DialogContent>
    </>
  );
};
