import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Calendar,
  Package,
  FileText,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SubscriptionInfo {
  plan_type: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  payment_id?: string;
  document_limit: number;
  documents_used: number;
}

export const SubscriptionManager = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const { toast } = useToast();

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get subscription details
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;

      // Get profile details for document limits
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("document_limit")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Get document usage count from document_analyses table
      const { count: documentsUsed, error: documentsError } = await supabase
        .from("document_analyses")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (documentsError) throw documentsError;

      if (!subscriptionData) {
        setSubscription(null);
        return;
      }

      setSubscription({
        ...subscriptionData,
        document_limit: profileData?.document_limit ?? 0,
        documents_used: documentsUsed || 0,
      });
    } catch (error: unknown) {
      console.error("Error fetching subscription:", error);
      toast({
        title: "Error loading subscription",
        description: error instanceof Error ? error.message : "Unable to load subscription details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanFeatures = (planType: string) => {
    switch (planType) {
      case "professional":
        return {
          name: "Professional",
          limit: 500,
          features: [
            "500 document analyses per month",
            "Priority email support (24-hour response)",
            "Advanced AI risk scoring",
            "Analytics dashboard",
            "60-day money-back guarantee",
          ],
        };
      case "enterprise":
        return {
          name: "Enterprise",
          limit: 999999,
          features: [
            "Unlimited document analyses",
            "24/7 priority support with dedicated manager",
            "Custom AI model training",
            "Advanced analytics and business intelligence",
            "API access",
            "60-day money-back guarantee",
          ],
        };
      case "basic":
        return {
          name: "Business Starter",
          limit: 50,
          features: [
            "50 document analyses per month",
            "Priority email support (24-hour response)",
            "Advanced clause highlights",
            "Document comparison tools",
            "30-day money-back guarantee",
          ],
        };
      case "pay_per_document":
        return {
          name: "Pay Per Use",
          limit: 0,
          features: [
            "$24 per contract analysis",
            "Professional 8-section reporting",
            "Risk scoring with recommendations",
            "PDF export for every analysis",
            "No ongoing commitment",
          ],
        };
      default:
        return {
          name: "Custom Plan",
          limit: 0,
          features: [
            "Tailored document quotas",
            "Dedicated support workflows",
            "Custom security reviews",
          ],
        };
    }
  };

  if (loading) {
    return <div>Loading subscription details...</div>;
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">No Active Subscription</CardTitle>
          <CardDescription>
            You currently don't have an active subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = "/pricing"}>
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  const planFeatures = getPlanFeatures(subscription.plan_type);
  const hasLimit = subscription.document_limit > 0;
  const usagePercentage = hasLimit
    ? (subscription.documents_used / subscription.document_limit) * 100
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {planFeatures.name} Plan
          </CardTitle>
          <CardDescription>
            Your current subscription details and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Period */}
          <div className="flex items-center gap-4 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">Billing Period</p>
              <p className="text-gray-600">
                {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </p>
            </div>
          </div>

          {/* Document Usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Document Usage</span>
              <span>
                {subscription.documents_used}
                {hasLimit ? ` / ${subscription.document_limit}` : " used"}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {hasLimit && usagePercentage > 80 && (
              <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Approaching document limit</span>
              </div>
            )}
          </div>

          {/* Plan Features */}
          <div className="space-y-3 mt-6">
            <h4 className="font-medium">Plan Features</h4>
            <ul className="space-y-2">
              {planFeatures.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Money-back Guarantee Notice */}
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">60-Day Money-Back Guarantee</p>
                <p>Not satisfied with our service? Get a full refund within 60 days of your subscription.</p>
              </div>
            </div>
          </div>

          {/* Billing Management */}
          <div className="flex flex-col gap-4 pt-4 border-t">
            <h4 className="font-medium">Billing Management</h4>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.location.href = "/pricing"}
              >
                <Package className="h-4 w-4" />
                Change Plan
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open("https://paypal.com", "_blank")}
              >
                <CreditCard className="h-4 w-4" />
                Manage Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
