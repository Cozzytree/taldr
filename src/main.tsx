// import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import Workspaces from "./pages/workspaces.tsx";
import IndexRoute from "./pages/index_route.tsx";
import WorkspaceCanvas from "./pages/worksapce_canvas.tsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { Toaster } from "./components/ui/sonner.tsx";
import TrialRoute from "./pages/trial_route.tsx";
import Preview from "./pages/preview_route.tsx";
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

const client = new QueryClient();
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ConvexProviderWithClerk>
  </ClerkProvider>,

  // </StrictMode>,
);
