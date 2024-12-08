import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button, buttonVariants } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
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
    <div className="h-full px-4 sm:p-0 w-full sm:container mx-auto flex flex-col items-center mb-10 gap-2 no-scrollbar-guide">
      <Head />

      <div className="mt-6 flex flex-col gap-5 justify-center">
        <TypewriterEffect
          words={[{ text: "WELCOME", className: "font-mono text-6xl" }]}
        />
        <span className="text-center">To</span>
        <h1 className="text-4xl text-center font-semibold">Taldr</h1>
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
              className={`${buttonVariants({ variant: "default", size: "lg" })} w-fit text-md`}
            >
              Try Out <ArrowRight />
            </Link>
          </div>
        )}
        <div className="w-full flex flex-col justify-center mt-10 gap-3">
          <p className="w-full text-center">
            This web app provides an interactive canvas where you can easily
            draw shapes, add text, and upload images to create custom designs.{" "}
            <br />
            Whether you're sketching, annotating, or crafting, the canvas offers
            a versatile space for your creativity.
          </p>
          <BackgroundGradient>
            <img
              loading="lazy"
              src="/canvas_only.png"
              className="rounded-[22px] border border-accent"
            />
          </BackgroundGradient>
        </div>
        <div className="w-full flex flex-col justify-center mt-10 gap-3">
          <p className="w-full text-center">
            Additionally, it includes an intuitive editor that lets you write
            and customize your content, making it perfect for creating detailed
            designs and annotations.
          </p>
          <BackgroundGradient>
            <img
              loading="lazy"
              src="/full_canvas.png"
              className="rounded-[22px]"
            />
          </BackgroundGradient>
        </div>
      </div>
    </div>
  );
}

const Head = () => {
  return (
    <header className="w-full sticky top-0 flex justify-between items-center bg-background py-2 z-[999]">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-semibold">T </h1>
        <span className="text-lg">aldr</span>
      </div>
      <SignedOut>
        <SignInButton signUpForceRedirectUrl={"/workspaces"}>
          <Button className="" size={"lg"}>
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
