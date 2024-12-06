import { Button, buttonVariants } from "@/components/ui/button";
import {
   SignedIn,
   SignedOut,
   SignInButton,
   UserButton,
   useUser,
} from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle } from "lucide-react";

export default function IndexRoute() {
   const { user, isLoaded } = useUser();

   if (!isLoaded) {
      return (
         <div className="text-sm text-foreground/70 h-screen w-full flex flex-col justify-center items-center">
            <LoaderCircle className="animate-spin" />
         </div>
      );
   }

   return (
      <div className="h-full w-full flex flex-col items-center">
         <Head />

         <div className="mt-6 flex flex-col gap-5 justify-center">
            <h1 className="text-2xl font-semibold text-center">Welcome</h1>
            <span className="text-center">To</span>
            <h1 className="text-4xl text-center font-semibold">Taldr</h1>
            <p className="text-md text-center">T aldr is a drawboard</p>

            {user?.id ? (
               <div className="flex justify-center">
                  <Link
                     href="/workspaces"
                     className={`${buttonVariants({ size: "sm" })} w-fit`}
                  >
                     Go to Workspaces <ArrowRight />
                  </Link>
               </div>
            ) : (
               <div className="w-full flex justify-center">
                  <Link
                     href="/trial"
                     className={`${buttonVariants({ variant: "default", size: "sm" })} w-fit text-md`}
                  >
                     Try Out <ArrowRight />
                  </Link>
               </div>
            )}

            <img
               src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fg8fxCb_jmtk%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=49fde8a2520f9babb3624eef131060dea392b7f873b20cef6f1696d497192997&ipo=images"
               className="w-[90vw] h-[500px]aspect-square rounded-md h-hull"
            />
         </div>
      </div>
   );
}

const Head = () => {
   return (
      <header className="w-full sticky top-0 flex justify-between items-center px-4 py-2">
         <div className="flex items-center gap-2">
            <h1 className="text-4xl font-semibold">T </h1>
            <span className="text-lg">aldr</span>
         </div>
         <SignedOut>
            <SignInButton signUpForceRedirectUrl={"/workspaces"}>
               <Button className="" size={"sm"}>
                  Sign In
               </Button>
            </SignInButton>
         </SignedOut>
         <SignedIn>
            <UserButton />
         </SignedIn>
      </header>
   );
};
