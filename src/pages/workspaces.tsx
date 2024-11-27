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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { EllipsisVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface workspace {
  name: string;
  userId: string;
  description: string;
  shapes: any[];
}

const useGetWorkspaces = (userId: string | undefined) => {
  const { isLoading, data, refetch } = useQuery<workspace[] | null>({
    queryFn: async () => {
      if (!userId) throw new Error("invalid user");

      const res = await fetch(
        `http://localhost:8080/user_workspaces/${userId}`,
      );
      if (!res.ok) {
        throw new Error("unknow error");
      }
      return await res.json();
    },
    queryKey: ["workspaces"],
    enabled: false,
  });
  return { isLoading, data, refetch };
};

const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: workspace) => {
      const res = await fetch(`http://localhost:8080/new_workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("internnal server error");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return { mutate, isLoading };
};

export default function Workspaces() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { user, isLoaded } = useUser();
  const { data, isLoading, refetch } = useGetWorkspaces(user?.id);
  const { mutate, isLoading: creatingWorkspace } = useCreateWorkspace();

  useEffect(() => {
    if (isLoaded && user?.id) {
      refetch();
    }
  }, [user, isLoaded, refetch]);

  if (isLoading && !isLoaded) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading
      </div>
    );
  }

  if (isLoaded && !user?.id) {
    navigate({ to: "/" });
  }

  const handleCreate = () => {
    if (!user?.id || name == "") return;
    mutate({
      name,
      shapes: [],
      description,
      userId: user.id,
    });
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

              <Button onClick={handleCreate}>Save</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:container mb-10">
        {data &&
          data.map((w, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-full flex items-center justify-between">
                  <Link
                    className={`${buttonVariants({ variant: "link", size: "sm" })} text-[1em]`}
                    href="/workspace/id"
                  >
                    {w.name}
                  </Link>

                  <AlertDialog>
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
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>

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
          ))}
      </div>
    </div>
  );
}
