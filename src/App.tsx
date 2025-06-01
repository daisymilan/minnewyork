
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { SignInPage } from "./components/auth/SignInPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import B2BDashboard from "./components/b2b/B2BDashboard";
import B2BKingDashboard from "./pages/B2BKingDashboard";

// Create a client
const queryClient = new QueryClient();

// Define the AppRoutes component using useAuth hook
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/b2b" element={<B2BDashboard />} />
      <Route path="/b2bking" element={<B2BKingDashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
