import { Button } from "@/components/ui/button";
import {
   SignedIn,
   SignedOut,
   SignInButton,
   UserButton,
} from "@clerk/clerk-react";

export default function IndexRoute() {
   return (
      <div className="h-full w-full flex flex-col items-center">
         <Head />

         <div className="mt-8 flex flex-col justify-center">
            <h1 className="text-3xl font-semibold text-center">Welcome</h1>
            <br />
            <span className="text-center">To</span>
            <h1 className="text-4xl text-center font-semibold">Taldr</h1>

            <p className="mt-6 mb-2 text-md text-center">
               T aldr is a drawboard
            </p>

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
