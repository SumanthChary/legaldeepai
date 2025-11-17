
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const PricingSection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Pay Per Use",
      price: "$24",
      period: "/contract",
      description: "Perfect for occasional contract reviews",
      features: [
        "Single contract analysis",
        "Comprehensive AI review",
        "Risk assessment",
        "Key clause extraction",
        "Downloadable report",
        "2-minute turnaround"
      ],
      highlight: false,
      ctaLabel: "Analyze Contract"
    },
    {
      name: "Pro Unlimited",
      price: isAnnual ? "$77" : "$97",
      period: "/month",
      originalPrice: isAnnual ? "$97" : undefined,
      description: "For professionals who review contracts regularly",
      features: [
        "Unlimited contract analysis",
        "All Pay Per Use features",
        "Priority processing",
        "Team collaboration",
        "API access",
        "Advanced analytics",
        "Custom templates",
        "Priority support"
      ],
      highlight: true,
      popular: true,
      badge: "Best Value",
      ctaLabel: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "On-premise deployment",
        "Custom AI training",
        "White-label options",
        "24/7 phone support"
      ],
      highlight: false,
      ctaLabel: "Contact Sales"
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Choose the plan that fits your needs. Start with pay-per-use or go unlimited with our Pro plan.
            </p>
          </div>

          <div className="flex justify-center items-center gap-3 mb-10">
            <span className={`text-base ${!isAnnual ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch 
              id="landing-pricing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-base ${isAnnual ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              Annual <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-sm ml-1 font-medium">Save 20%</span>
            </span>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <InView
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                  plan.highlight 
                    ? 'border-2 border-primary shadow-lg shadow-primary/20 scale-105' 
                    : 'border border-border hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-accent text-white shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-3 text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-3">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through mr-2">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-foreground">
                        <Check className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => navigate('/pricing')}
                    className={`w-full ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-md' 
                        : 'bg-background hover:bg-primary/10 text-foreground border border-border'
                    }`}
                    size="lg"
                  >
                    {plan.ctaLabel}
                  </Button>
                </CardContent>
              </Card>
            </InView>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10"
          >
            View all pricing options →
          </Button>
        </div>
      </div>
    </div>
  );
};
