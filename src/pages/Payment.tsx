
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "./Payment.css";
import { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface LocationState {
  plan?: {
    name: string;
    price: string;
    period: string;
  };
}

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonsComponentProps {
  style: any;
  disabled?: boolean;
  forceReRender?: any[];
  fundingSource?: string;
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError: (err: any) => void;
  onCancel: () => void;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { plan } = (location.state as LocationState) || {};

  // Debug PayPal script loading
  useEffect(() => {
    const checkPayPalLoaded = () => {
      if (typeof window !== 'undefined' && window.paypal) {
        console.log("PayPal script loaded successfully");
        setPaypalLoaded(true);
      } else {
        console.log("PayPal script not loaded yet, retrying...");
        setTimeout(checkPayPalLoaded, 1000);
      }
    };
    checkPayPalLoaded();
    return () => clearTimeout(checkPayPalLoaded as unknown as number);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue with payment.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue with payment.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Unexpected error checking user:", error);
        navigate("/auth");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (!plan && !checkingAuth) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan from the pricing page.",
        variant: "destructive",
      });
      navigate("/pricing");
    }
  }, [plan, navigate, toast, checkingAuth]);

  if (checkingAuth) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!plan || !user) {
    return null;
  }

  const amount = plan.price.replace("$", "");

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      setLoading(true);
      const details = await actions.order.capture();
      console.log("PayPal transaction completed:", details);
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const planType = plan.name.toLowerCase().replace(/\s+/g, '_') as SubscriptionTier;

      // Call our Supabase Edge Function to process the payment
      const { data: processResult, error: processError } = await supabase.functions.invoke(
        'process-paypal-payment',
        {
          body: {
            orderId: details.id,
            userId: user.id,
            planType,
            amount: amount
          }
        }
      );

      if (processError) {
        throw new Error(processError.message || 'Payment processing failed');
      }

      if (!processResult.success) {
        throw new Error(processResult.message || 'Payment processing failed');
      }

      toast({
        title: "Payment Successful!",
        description: `You are now subscribed to the ${plan.name} plan!`,
        duration: 5000,
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal error:", err);
    const errorMessage = err.message || "There was an error with PayPal.";
    console.log("Full error details:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
      details: err.details
    });
    toast({
      title: "Payment Error",
      description: `${errorMessage} Please try again or contact support.`,
      variant: "destructive",
    });
  };

  const handlePayPalCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can always come back to complete your subscription.",
    });
  };

  // PayPal configuration
  const paypalOptions = {
    "client-id": "AZiHrC_GIm4eru7Ql0zgdwXuBv9tWhcL-WE1ZQyCIBIKGFvGWTt5r9IcPXrkVm8fWlDhzRuMF9IGBD0_",
    currency: "USD",
    intent: "capture",
    components: "buttons",
    "data-namespace": "PayPalSDK",
    // Set to 'sandbox' for testing with new accounts
    "enable-funding": "card",
    "disable-funding": "paylater,venmo", // Disable advanced features for new accounts
    "buyer-country": "US" // Add your target country code
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Complete Your Subscription
              </h1>
              <p className="text-xl text-gray-600">
                Secure payment processing with enterprise-grade encryption
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
                      <p className="text-gray-600">Professional AI document analysis</p>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {plan.price}<span className="text-sm text-gray-500">{plan.period}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-3 py-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Unlimited document analysis</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Advanced AI insights</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-lg">{plan.period}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                  Payment Method
                </h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      PayPal - Secure & Instant
                    </h3>
                    
                    <div id="paypal-button-container" className="w-full min-h-[200px]">
                      <PayPalScriptProvider options={paypalOptions}>
                        {loading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                            <span className="text-blue-600">Processing payment...</span>
                          </div>
                        ) : (
                          <PayPalButtons
                            style={{
                              layout: "vertical",
                              color: "gold",
                              shape: "rect",
                              label: "pay"
                            }}
                            createOrder={(data, actions) => {
                              console.log("Creating order with amount:", amount);
                              return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                  {
                                    amount: {
                                      value: amount,
                                      currency_code: "USD"
                                    }
                                  }
                                ]
                              });
                            }}
                            onApprove={handlePayPalApprove}
                            onCancel={handlePayPalCancel}
                            onError={handlePayPalError}
                          />
                        )}
                      </PayPalScriptProvider>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 opacity-50">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                      Razorpay - Coming Soon
                    </h3>
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Razorpay integration is coming soon! Use PayPal for now.
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 opacity-50">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                      Credit Card - Coming Soon
                    </h3>
                    <Button
                      className="w-full h-12 bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      Credit Card Payment (Coming Soon)
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Secure Payment Processing</p>
                      <p>Your payment information is encrypted and secure. We never store your payment details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
