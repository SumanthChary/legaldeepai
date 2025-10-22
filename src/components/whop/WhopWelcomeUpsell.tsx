import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, Star, ArrowRight, Gift } from 'lucide-react';
import { WhopService, WHOP_PLANS } from '@/integrations/whop';

export function WhopWelcomeUpsell() {
  const [isWhopUser, setIsWhopUser] = useState(false);

  useEffect(() => {
    setIsWhopUser(WhopService.isWhopUser());
  }, []);

  if (!isWhopUser) {
    return null;
  }

  const handleUpgrade = (planId: string) => {
    WhopService.redirectToWhopCheckout(planId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-300 text-sm px-4 py-2">
            🎉 Welcome from Whop!
          </Badge>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Special Launch Pricing for Whop Users
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            You're getting exclusive access to LegalDeep AI with special Whop marketplace pricing. 
            Choose your plan and start transforming your legal workflow today!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Highlighted Popular Plan */}
            <Card className="relative border-2 border-blue-500 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                  MOST POPULAR
                </Badge>
              </div>
              
              <CardHeader className="pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-xl">{WHOP_PLANS.BUSINESS_GUARDIAN.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${WHOP_PLANS.BUSINESS_GUARDIAN.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {WHOP_PLANS.BUSINESS_GUARDIAN.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleUpgrade(WHOP_PLANS.BUSINESS_GUARDIAN.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
                >
                  Start Subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  30-day money-back guarantee • Cancel anytime • Secure Whop checkout
                </p>
              </CardContent>
            </Card>

            {/* Lifetime Deal */}
            <Card className="relative border-2 border-emerald-500 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1">
                  LIFETIME DEAL
                </Badge>
              </div>
              
              <CardHeader className="pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-6 w-6 text-emerald-500" />
                  <CardTitle className="text-xl">{WHOP_PLANS.LIFETIME_POWER_PACK.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${WHOP_PLANS.LIFETIME_POWER_PACK.price}</span>
                  <span className="text-gray-500">one-time</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {WHOP_PLANS.LIFETIME_POWER_PACK.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleUpgrade(WHOP_PLANS.LIFETIME_POWER_PACK.id)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3"
                  variant="outline"
                >
                  Get Lifetime Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  One-time payment • No recurring fees • Secure Whop checkout
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Signals */}
          <div className="text-center space-y-4 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Secure Whop Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Access</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Join 2,500+ legal professionals already using LegalDeep AI to save time and improve accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}