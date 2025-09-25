
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
            className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1
              ${plan.highlight 
                ? 'border-blue-200 shadow-lg scale-105' 
                : 'border-gray-200 shadow-sm'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">{plan.name}</h3>
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="text-lg text-gray-400 line-through mb-1">
                      ${plan.originalPrice}{plan.period}
                    </div>
                  )}
                  <div className="flex items-baseline justify-center">
                    {plan.price !== "0" && plan.price !== "Custom" && <span className="text-2xl font-medium text-gray-900">$</span>}
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-lg text-gray-600 ml-1">{plan.period}</span>}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
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
