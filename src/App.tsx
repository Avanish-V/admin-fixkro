import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import OfferForm from "./pages/OfferForm";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Transactions from "./pages/Transactions";
import Professionals from "./pages/Professionals";
import ProfessionalForm from "./pages/ProfessionalForm";
import Cities from "./pages/Cities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/new" element={<OfferForm />} />
          <Route path="/offers/:id/edit" element={<OfferForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/professionals/new" element={<ProfessionalForm />} />
          <Route path="/professionals/:id/edit" element={<ProfessionalForm />} />
          <Route path="/cities" element={<Cities />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
