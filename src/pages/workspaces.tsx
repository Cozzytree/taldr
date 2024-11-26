import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export default function Workspaces() {
   return (
      <div className="min-h-screen w-full flex flex-col items-center gap-10 justify-center">
         <h1 className="text-xl font-semibold text-start w-full px-3 sm:px-10">
            Workspaces
         </h1>
         <div className="flex flex-col gap-2 w-full sm:container mb-10">
            {Array.from({ length: 10 }).map((_, i) => (
               <Link key={i} href="/workspace/id">
                  <Card>
                     <CardHeader>Title</CardHeader>
                     <CardContent>Description</CardContent>
                  </Card>
               </Link>
            ))}
         </div>
      </div>
   );
}
