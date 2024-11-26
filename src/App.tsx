import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "./components/theme-provider";

function App() {
   return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <div className="min-h-screen w-full">
            <Outlet />
         </div>
         {/* <Canvas /> */}
      </ThemeProvider>
   );
}

export default App;
