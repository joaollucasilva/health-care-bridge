import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import PatientDashboard from "@/components/dashboards/PatientDashboard";
import AttendantDashboard from "@/components/dashboards/AttendantDashboard";
import ManagerDashboard from "@/components/dashboards/ManagerDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return <AuthPage />;
  }

  const renderDashboard = () => {
    switch (profile.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'attendant':
        return <AttendantDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      default:
        return <NotFound />;
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={renderDashboard()} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
