
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
import { Input } from "@/components/ui/input";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface LocationState {
  plan?: {
    name: string;
    price: string;
    period: string;
  };
}


const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
const { plan } = (location.state as LocationState) || {};

  // Dodo manual confirmation state
  const [transactionId, setTransactionId] = useState("");
  const [confirming, setConfirming] = useState(false);

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
      
      // Redirect to success page with plan details
      navigate(`/payment-success?plan=${encodeURIComponent(plan.name)}&amount=${amount}`);
      
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

  const handleDodoPayment = async () => {
    try {
      setLoading(true);

      if (!user) {
        throw new Error("User not authenticated");
      }

      const normalized = plan.name.toLowerCase();
      let key: 'free' | 'starter' | 'professional' | null = null;
      if (normalized.includes('free')) key = 'free';
      else if (normalized.includes('starter') || normalized.includes('basic')) key = 'starter';
      else if (normalized.includes('pro')) key = 'professional';

      const links: Record<'free' | 'starter' | 'professional', string> = {
        free: 'https://checkout.dodopayments.com/buy/pdt_TnYlrnizcTJnz9NfobZ4Q?quantity=1',
        starter: 'https://checkout.dodopayments.com/buy/pdt_Jgmj7LlELZOYBqqn4ZyaV?quantity=1',
        professional: 'https://checkout.dodopayments.com/buy/pdt_P897Pxm3ekfhjbdnwWVw1?quantity=1',
      };

      const url = key ? links[key] : null;
      if (!url) {
        throw new Error('Unsupported plan for Dodo checkout. Please use PayPal or contact support.');
      }

      window.open(url, '_blank', 'noopener,noreferrer');

      toast({
        title: 'Complete payment in Dodo',
        description: 'After completing checkout, paste your Dodo transaction ID below and press Confirm to activate your plan.',
        duration: 7000,
      });
    } catch (error: any) {
      console.error("Dodo checkout error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was an error opening Dodo checkout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dodo manual confirmation after redirect
  const handleConfirmDodoPayment = async () => {
    try {
      setConfirming(true);

      if (!user) throw new Error('User not authenticated');
      if (!transactionId.trim()) throw new Error('Please paste your Dodo transaction ID');

      const planType = plan.name.toLowerCase().replace(/\s+/g, '_') as SubscriptionTier;

      const { data: processResult, error: processError } = await supabase.functions.invoke(
        'process-dodo-payment',
        {
          body: {
            transactionId: transactionId.trim(),
            userId: user.id,
            planType,
            amount: amount,
          }
        }
      );

      if (processError) throw new Error(processError.message || 'Payment processing failed');
      if (!processResult?.success) throw new Error(processResult?.error || 'Payment not verified');

      toast({
        title: 'Payment verified',
        description: `You are now subscribed to the ${plan.name} plan!`,
        duration: 5000,
      });

      navigate(`/payment-success?plan=${encodeURIComponent(plan.name)}&amount=${amount}&method=dodo`);
    } catch (error: any) {
      console.error('Confirm Dodo payment error:', error);
      toast({
        title: 'Verification failed',
        description: error.message || 'We could not verify your Dodo payment. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setConfirming(false);
    }
  };

  // PayPal configuration
  const paypalOptions = {
    clientId: "AZiHrC_GIm4eru7Ql0zgdwXuBv9tWhcL-WE1ZQyCIBIKGFvGWTt5r9IcPXrkVm8fWlDhzRuMF9IGBD0_",
    currency: "USD",
    intent: "capture",
    components: "buttons",
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
                      <span>{plan.name === 'Professional' ? '500' : plan.name === 'Enterprise' ? 'Unlimited' : '25'} document analyses/month</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Advanced AI risk detection</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Priority email support</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>60-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Cancel anytime</span>
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

                  <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                      Dodo Payments - Fast & Secure
                    </h3>
                    
                    <button
                      className={`w-full relative overflow-hidden rounded-lg transition-all duration-200 ${
                        loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'
                      }`}
                      onClick={handleDodoPayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="h-12 bg-[#9acd32] flex items-center justify-center rounded-lg">
                          <Loader2 className="h-5 w-5 animate-spin text-black mr-2" />
                          <span className="text-black font-semibold">Opening checkout...</span>
                        </div>
                      ) : (
                        <img 
                          src="/dodo-payments-button.png" 
                          alt="Pay with Dodo Payments" 
                          className="w-full h-12 object-cover rounded-lg"
                        />
                      )}
                    </button>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,auto]">
                      <Input
                        placeholder="Paste Dodo transaction ID to confirm"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        disabled={confirming}
                      />
                      <Button
                        className="h-12"
                        variant="secondary"
                        onClick={handleConfirmDodoPayment}
                        disabled={confirming || !transactionId.trim()}
                      >
                        {confirming ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Confirming...
                          </>
                        ) : (
                          'Confirm Dodo Payment'
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      We'll verify your payment with Dodo before activating your plan.
                    </p>
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
                
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Bank-Level Security</p>
                        <p>Your payment is protected by 256-bit SSL encryption. We never store your payment details.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="flex flex-col items-center">
                      <Shield className="h-4 w-4 text-green-600 mb-1" />
                      <span className="text-gray-600">SSL Encrypted</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mb-1" />
                      <span className="text-gray-600">60-Day Guarantee</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-4 w-4 text-green-600 mb-1" />
                      <span className="text-gray-600">Multi-Payment Options</span>
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
