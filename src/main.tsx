// import { StrictMode } from "react";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
const App = lazy(() => import("./App.tsx"));
const Workspaces = lazy(() => import("./pages/workspaces.tsx"));
const Preview = lazy(() => import("./pages/preview_route.tsx"));
const IndexRoute = lazy(() => import("./pages/index_route.tsx"));
const TrialRoute = lazy(() => import("./pages/trial_route.tsx"));
const WorkspaceCanvas = lazy(() => import("./pages/worksapce_canvas.tsx"));
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { Toaster } from "./components/ui/sonner.tsx";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const rootRoute = createRootRoute({
  component: () => <App />,
});

const indexRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: () => <IndexRoute />,
});

const workspacesRoute = createRoute({
  path: "/workspaces",
  getParentRoute: () => rootRoute,
  component: () => <Workspaces />,
});

const canvasRoute = createRoute({
  path: "/workspace/$id",
  getParentRoute: () => rootRoute,
  component: () => <WorkspaceCanvas />,
});

const previewRoute = createRoute({
  path: "/preview/$id",
  getParentRoute: () => rootRoute,
  component: () => <Preview />,
});

const trialRoute = createRoute({
  path: "/trial",
  getParentRoute: () => rootRoute,
  component: () => <TrialRoute />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  canvasRoute,
  trialRoute,
  previewRoute,
  workspacesRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ConvexProviderWithClerk>
  </ClerkProvider>,

  // </StrictMode>,
);
