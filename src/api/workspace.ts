import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateName = () => {
   const { mutate, isLoading } = useMutation({
      mutationFn: async (data: {
         workspaceId: string;
         name: string;
         userId: string;
      }) => {
         try {
            const response = await fetch(
               `${
                  import.meta.env.VITE_MODE === "development"
                     ? "http://localhost:8080"
                     : import.meta.env.VITE_API_URL
               }/update_name`,
               {
                  method: "PATCH",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
               },
            );

            if (!response.ok) {
               throw new Error("Something went wrong");
            }

            return response;
         } catch (e: unknown) {
            if (e instanceof Error) {
               throw new Error(e.message || "Something went wrong");
            }
         }
      },
      onError: (err) => {
         if (err instanceof Error)
            toast.error(err.message || "error while updating");
      },
   });
   return { mutate, isLoading };
};

const useUpdateDescription = () => {
   const { mutate, isLoading } = useMutation({
      mutationFn: async (data: {
         workspaceId: string;
         description: string;
         userId: string;
      }) => {
         try {
            const response = await fetch(
               `${
                  import.meta.env.VITE_MODE === "development"
                     ? "http://localhost:8080"
                     : import.meta.env.VITE_API_URL
               }/update_description`,
               {
                  method: "PATCH",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
               },
            );

            if (!response.ok) {
               throw new Error("Something went wrong");
            }

            return response;
         } catch (e: unknown) {
            if (e instanceof Error) {
               throw new Error(e.message || "Something went wrong");
            }
         }
      },
      onError: (err) => {
         if (err instanceof Error)
            toast.error(err.message || "error while updating");
      },
   });
   return { mutate, isLoading };
};

export { useUpdateName, useUpdateDescription };
