import Canvas from "./_canvas/canvas";
import { ThemeProvider } from "./components/theme-provider";

function App() {
   return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <Canvas />
      </ThemeProvider>
   );
}

export default App;
