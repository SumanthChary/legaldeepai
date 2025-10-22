import { WhopService, WHOP_PLANS } from '@/integrations/whop';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Infinity } from 'lucide-react';

export const WhopPricingPlans = () => {
  const isWhopUser = WhopService.isWhopUser();

  if (!isWhopUser) {
    return null; // Only show for Whop users
  }

  const handlePlanSelect = (planId: string) => {
    WhopService.redirectToWhopCheckout(planId);
  };

  const plans = [
    {
      ...WHOP_PLANS.ENTREPRENEUR_SHIELD,
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      popular: false,
      gradient: "from-amber-500/20 to-orange-500/20",
      badge: undefined
    },
    {
      ...WHOP_PLANS.BUSINESS_GUARDIAN,
      icon: <Crown className="h-6 w-6 text-blue-500" />,
      popular: true,
      gradient: "from-blue-500/20 to-purple-500/20",
      badge: undefined
    },
    {
      ...WHOP_PLANS.LEGAL_COMMAND_CENTER,
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      popular: false,
      gradient: "from-purple-500/20 to-pink-500/20",
      badge: undefined
    },
    {
      ...WHOP_PLANS.LIFETIME_POWER_PACK,
      icon: <Infinity className="h-6 w-6 text-emerald-500" />,
      popular: false,
      gradient: "from-emerald-500/20 to-teal-500/20",
      badge: "LIFETIME DEAL"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            Powered by Whop
          </Badge>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
          Choose Your Legal AI Plan
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Secure checkout and instant access through Whop's trusted platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              plan.popular ? 'border-primary shadow-lg' : 'hover:border-primary/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-purple-500 text-white text-center py-1 text-sm font-semibold">
                MOST POPULAR
              </div>
            )}
            
            {plan.badge && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-1 text-sm font-semibold">
                {plan.badge}
              </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
            
            <CardHeader className={`relative ${plan.popular || plan.badge ? 'pt-8' : 'pt-6'}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {plan.icon}
                  {plan.name}
                </CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">
                  {'isLifetime' in plan && plan.isLifetime ? 'lifetime' : '/month'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Documents</span>
                  <Badge variant="outline">{plan.documents}{'isLifetime' in plan && plan.isLifetime ? ' lifetime' : '/month'}</Badge>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90' 
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {'isLifetime' in plan && plan.isLifetime ? 'Get Lifetime Access' : 'Start Subscription'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Whop • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Protected by Whop's secure payment system • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};