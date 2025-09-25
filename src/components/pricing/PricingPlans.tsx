
import { useState } from "react";
import { PricingButton } from "./PricingButton";
import { Check, Sparkles } from "lucide-react";

interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  originalPrice?: string;
}

interface PricingPlansProps {
  plans: PlanProps[];
  isAnnual: boolean;
}

export const PricingPlans = ({ plans, isAnnual }: PricingPlansProps) => {
  return (
    <div className="px-4 mb-12 md:mb-16">
      {/* Responsive grid that adapts to number of plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-card rounded-2xl border transition-all duration-300 hover:shadow-[var(--hover-shadow)] hover:-translate-y-1
              ${plan.highlight 
                ? 'border-accent/30 shadow-[var(--law-firm-shadow)] scale-105 ring-1 ring-accent/10' 
                : 'border-border shadow-[var(--card-shadow)]'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-xs font-semibold font-aeonik shadow-[var(--accent-glow)] border border-accent/20">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold mb-4 text-primary font-aeonik tracking-tight">{plan.name}</h3>
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="text-lg text-muted-foreground line-through mb-1">
                      ${plan.originalPrice}{plan.period}
                    </div>
                  )}
                  <div className="flex items-baseline justify-center">
                    {plan.price !== "0" && plan.price !== "Custom" && <span className="text-2xl font-semibold text-primary">$</span>}
                    <span className="text-4xl font-bold text-primary font-aeonik tracking-tight">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-lg text-muted-foreground ml-1 font-aeonik">{plan.period}</span>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-aeonik">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-foreground">
                      <Check className="h-4 w-4 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span className="font-aeonik">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <PricingButton plan={plan} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
