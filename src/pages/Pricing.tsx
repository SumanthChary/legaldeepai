import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Pay Per Use",
      price: "$24",
      period: "/contract",
      description: "Perfect for occasional contract reviews",
      features: [
        "Single contract analysis",
        "Comprehensive AI review",
        "Risk assessment & scoring",
        "Key clause extraction",
        "Downloadable PDF report",
        "2-minute turnaround time",
        "Email support"
      ],
      icon: Zap,
      ctaLabel: "Analyze Contract Now",
      ctaLink: "/auth"
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
        "Priority processing queue",
        "Team collaboration tools",
        "Full API access",
        "Advanced analytics dashboard",
        "Custom report templates",
        "Priority email & chat support",
        "7-day free trial included"
      ],
      icon: Shield,
      popular: true,
      badge: "Best Value",
      ctaLabel: "Start Free Trial",
      ctaLink: "/auth"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Pro Unlimited",
        "Custom integrations & API",
        "Dedicated account manager",
        "SLA guarantees (99.9% uptime)",
        "On-premise deployment option",
        "Custom AI model training",
        "White-label solutions",
        "Volume discounts available",
        "24/7 phone support"
      ],
      icon: Users,
      ctaLabel: "Contact Sales",
      ctaLink: "/support"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <Header />
      
      <main className="flex-grow py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the plan that fits your needs. Start with pay-per-use or go unlimited with our Pro plan.
            </p>

            {/* Annual Toggle */}
            <div className="flex justify-center items-center gap-3 mb-8">
              <span className={`text-base ${!isAnnual ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch 
                id="pricing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-base ${isAnnual ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                Annual <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-sm ml-1 font-medium">Save 20%</span>
              </span>
            </div>

            {isAnnual && (
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 text-foreground text-center text-sm py-3 px-6 rounded-lg">
                  💰 Annual billing: Save $240/year with Pro Unlimited — Limited time offer
                </div>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-2 border-primary shadow-lg shadow-primary/20 scale-105' 
                      : 'border border-border hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-accent text-white shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-3">
                        {plan.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through mr-2">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm text-foreground">
                          <Check className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate(plan.ctaLink)}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-md' 
                          : 'bg-background hover:bg-primary/10 text-foreground border border-border'
                      }`}
                      size="lg"
                    >
                      {plan.ctaLabel}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust Section */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-border/40 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground mb-1">Accuracy Rate</div>
                  <div className="text-xs text-muted-foreground">Certified by legal experts</div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">2 Min</div>
                  <div className="text-sm text-muted-foreground mb-1">Average Analysis</div>
                  <div className="text-xs text-muted-foreground">vs 2+ hours manually</div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground mb-1">Expert Support</div>
                  <div className="text-xs text-muted-foreground">Always here to help</div>
                </CardContent>
              </Card>
            </div>

            {/* Money-Back Guarantee */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  🔒 Risk-Free 30-Day Money-Back Guarantee
                </h3>
                <p className="text-muted-foreground mb-4">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
                <p className="text-sm text-foreground font-medium">
                  Review 1000+ Documents in minutes, not days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
