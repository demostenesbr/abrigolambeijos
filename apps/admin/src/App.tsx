import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";

function App() {
  return (
    <html lang="pt-BR" className="h-full">
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <main className="flex-1">
          <RouterProvider router={router} />;
        </main>
      </body>
    </html>
  );
}

export default App;
