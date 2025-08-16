import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ChatWidget } from "@/components/chat/ChatWidget";

// Import pages directly instead of lazy loading
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import DocumentSummary from "./pages/DocumentSummary";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Documentation from "./pages/Documentation";
import ChatPage from "./pages/ChatPage";
import { Dashboard } from "@/components/dashboard";
import { MainApp } from "@/components/MainApp";
import { useAuthSession } from "@/components/header";
import ESignatures from "./pages/ESignatures";
import Support from "./pages/Support";
import WhopCallback from "./pages/WhopCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// PayPal configuration with proper error handling
const paypalOptions = {
  clientId: "ASwEnGxUl0eURMQkZ7lolWGxgRznZ9lx-h55cblFMiJj0qYOzluIe5BFBdeGYhwyabLRHZZvBPAJJBv6",
  currency: "USD",
  intent: "capture" as const,
  components: "buttons" as const,
  "disable-funding": "credit,card" as const, // Disable credit card options to focus on PayPal
};

function App() {
  return (
    <PayPalScriptProvider 
      options={paypalOptions}
      deferLoading={false}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/index" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/document-analysis" element={<DocumentAnalysis />} />
              <Route path="/document-summary/:id" element={<DocumentSummary />} />
              <Route path="/document/:id/summary" element={<DocumentSummary />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/dashboard" element={<MainApp />} />
              <Route path="/chat" element={<MainApp />} />
              <Route path="/esignatures" element={<MainApp />} />
              <Route path="/support" element={<Support />} />
              <Route path="/whop/callback" element={<WhopCallback />} />
            </Routes>
            <ChatWidget />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}

export default App;
