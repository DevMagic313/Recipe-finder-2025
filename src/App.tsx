import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create router with the new API to avoid future flag warnings
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>
  },
  {
    path: "/recipes",
    element: <Layout><Recipes /></Layout>
  },
  {
    path: "/recipe/:id",
    element: <Layout><RecipeDetail /></Layout>
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>
  },
  {
    path: "/contact",
    element: <Layout><Contact /></Layout>
  },
  {
    path: "*",
    element: <Layout showSearch={false}><NotFound /></Layout>
  }
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShoppingListProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </ShoppingListProvider>
  </QueryClientProvider>
);

export default App;
