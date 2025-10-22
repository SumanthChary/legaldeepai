
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PlanType {
  name: string;
  price: string;
  period: string;
  ctaLabel?: string;
  trialAvailable?: boolean;
  trialLengthDays?: number;
  tier?: string;
}

interface PricingButtonProps {
  plan: PlanType;
  className?: string;
}

export const PricingButton = ({ plan, className }: PricingButtonProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    
    try {
      // Handle Enterprise plan - redirect to contact page
      if (plan.name === "Enterprise") {
        navigate("/support");
        setLoading(false);
        return;
      }
      
      // Check if the user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with your subscription.",
        });
        navigate("/auth", {
          state: {
            redirectAfterAuth: "/pricing",
            selectedPlan: plan
          }
        });
        return;
      }

      // Check user's current plan status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("document_limit, document_count, email")
        .eq("id", session.user.id)
        .single();

      if (!profileError && profile) {
        // Special handling for admin email - always has unlimited access
        if (profile.email === 'enjoywithpandu@gmail.com') {
          toast({
            title: "Admin Account Detected",
            description: "You already have unlimited access to all features",
          });
          navigate("/dashboard");
          return;
        }

        // Check if user already has unlimited access (through payment)
        if (profile.document_limit >= 999999) {
          toast({
            title: "You already have unlimited access",
            description: "Your account has premium capabilities",
          });
          navigate("/dashboard");
          return;
        }
      }

      // Navigate to payment page for paid plans
      const formattedPrice = plan.price.startsWith("$") ? plan.price : `$${plan.price}`;
      navigate("/payment", { 
        state: { 
          plan: {
            name: plan.name,
            price: formattedPrice,
            period: plan.period,
            trialAvailable: plan.trialAvailable,
            trialLengthDays: plan.trialLengthDays,
            tier: plan.tier
          }
        }
      });
    } catch (error: unknown) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full text-sm md:text-base py-2 md:py-3 ${className ?? ''}`.trim()}
      variant={plan.name === "Enterprise" ? "outline" : "default"}
      size="lg"
      onClick={handleGetStarted}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        plan.ctaLabel ?? (plan.name === "Enterprise" ? "Contact Sales" : "Choose Plan")
      )}
    </Button>
  );
};
