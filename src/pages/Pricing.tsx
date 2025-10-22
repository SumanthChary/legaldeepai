import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/layout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { getPricingPlans } from "@/components/pricing/pricingData";
import { WhopPricingPlans } from "@/components/whop";
import { WhopService } from "@/integrations/whop";
const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const isWhopUser = WhopService.isWhopUser();
  const plans = getPricingPlans(isAnnual);
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isAnnual && <div className="mb-6">
              <div className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center text-xs sm:text-sm py-2 rounded-md">
                💰 Annual billing: Save up to 40% — Limited time offer
              </div>
            </div>}
          <PricingHeader />
          
          {/* Show Whop pricing for Whop users, regular pricing for others */}
          {isWhopUser ? <WhopPricingPlans /> : <>
              <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
              <PricingPlans plans={plans} />
            </>}
          
          {/* Trust and Social Proof Section */}
          <div className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Trained On 10,000+ Legal Documents & Cases</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Certified by legal experts</div>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">2 Min</div>
                  <div className="text-sm text-gray-600">Average Analysis</div>
                  <div className="text-xs text-gray-500 mt-1">vs 2+ hours manually</div>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Expert Support</div>
                  <div className="text-xs text-gray-500 mt-1">Always here to help</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔒 Risk-Free 30-Day Money-Back Guarantee
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
                <div className="text-center text-sm text-gray-600 font-medium">Review 1000+ Documents in few minutes</div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-6">Join Legal professionals who save 20+ hours per week</p>
                <div className="flex justify-center items-center space-x-2 text-yellow-500">
                  {Array.from({
                  length: 5
                }).map((_, i) => <span key={i} className="text-lg">⭐</span>)}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 from loved people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
    </div>;
};
export default Pricing;