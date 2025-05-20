
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { KitchenProvider } from "./contexts/KitchenContext";
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Meals from "./pages/Meals";
import Serving from "./pages/Serving";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <KitchenProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ingredients" element={<Ingredients />} />
                <Route path="/meals" element={<Meals />} />
                <Route path="/serving" element={<Serving />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
          <Toaster />
        </KitchenProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
