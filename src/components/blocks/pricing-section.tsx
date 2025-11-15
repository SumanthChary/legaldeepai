
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PricingButton } from "@/components/pricing/PricingButton";
import { getPricingPlans } from "@/components/pricing/pricingData";

type PricingPlan = ReturnType<typeof getPricingPlans>[number];

export const PricingSection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = useMemo(() => getPricingPlans(isAnnual), [isAnnual]);

  return (
    <div className="py-8 md:py-12 lg:py-16 xl:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4 lg:mb-6">
              Choose Your Legal AI Plan
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-2">
              From solo practitioners to enterprise firms—unlock the power of AI-driven legal document analysis from day one.
            </p>
            <p className="text-sm md:text-base text-primary font-medium mb-4 md:mb-6">
              Every subscription starts with a 7-day free trial. Cancel anytime before billing begins.
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-10">
            <span className={`text-sm md:text-base ${!isAnnual ? 'font-medium' : 'text-gray-600'}`}>Monthly</span>
            <Switch 
              id="landing-pricing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm md:text-base ${isAnnual ? 'font-medium' : 'text-gray-600'}`}>
              Annual <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded ml-1">Save 20%</span>
            </span>
          </div>
        </InView>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                className={`relative h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  plan.highlight 
                    ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-100' 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                {(plan.popular || plan.badge) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {plan.badge || 'Most Popular'}
                    </span>
                  </div>
                )}
                
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price.startsWith("$") || plan.price === "Custom" ? plan.price : `$${plan.price}`}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-gray-500">
                        <span className="line-through">{plan.originalPrice}</span> 
                        <span className="ml-2 text-green-600 font-medium">Save 20%</span>
                      </p>
                    )}
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  <ul className="space-y-2 md:space-y-3 lg:space-y-4 mb-4 md:mb-6 lg:mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600 text-xs md:text-sm lg:text-base">
                        <Check className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 text-success mr-1.5 md:mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <PricingButton 
                    plan={plan}
                    className={plan.highlight ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' : ''}
                  />
                </CardContent>
              </Card>
            </InView>
          ))}
        </div>
        
        <div className="text-center mt-6 md:mt-8 lg:mt-10">
          <Button 
            variant="link"
            className="text-primary font-medium text-sm md:text-base"
            onClick={() => navigate("/pricing")}
          >
            View all pricing options
          </Button>
        </div>
      </div>
      
    </div>
  );
};
