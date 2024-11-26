import { StrictMode } from "react";
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
import { ClerkProvider } from "@clerk/clerk-react";

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

const routeTree = rootRoute.addChildren([
   indexRoute,
   workspacesRoute,
   canvasRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
   interface Register {
      router: typeof router;
   }
}

createRoot(document.getElementById("root")!).render(
   // <StrictMode>
   <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
   </ClerkProvider>,
   // </StrictMode>,
);
