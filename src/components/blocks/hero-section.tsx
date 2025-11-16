import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

interface HeroProps {
  benefits: string[];
  isWhopUser?: boolean;
}

export const HeroSection = ({ benefits, isWhopUser = false }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-white min-h-screen flex items-center py-20">
      {/* Subtle gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/30 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/20 to-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main Headline */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
              Catch <span className="italic font-serif text-teal-600">[Contract Traps]</span>
              <br />
              Before They Cost You <span className="text-emerald-600">$300+</span>
            </h1>
          </InView>

          {/* Subheadline */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload any contract. Get instant AI analysis in 2 minutes. Catch hidden clauses lawyers charge $500+ to find.
            </p>
          </InView>

          {/* CTA Button */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xl px-12 py-8 h-auto shadow-2xl hover:shadow-teal-500/50 transition-all rounded-2xl font-bold"
                onClick={() => navigate("/document-analysis")}
              >
                Analyze Contract - $24
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </InView>

          {/* Trust Indicators */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-600 text-sm mb-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600" />
                2-minute analysis
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-600" />
                Bank-level security
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-600" />
                Money-back guarantee
              </span>
            </p>
          </InView>

          {/* Value Comparison Box */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-sm border-2 border-teal-200 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl mb-16">
              <p className="text-sm text-gray-600 mb-3 font-medium">Traditional Approach:</p>
              <div className="space-y-2 mb-4">
                <p className="text-lg text-gray-400 line-through">Lawyer consultation: $300-500</p>
                <p className="text-lg text-gray-400 line-through">Basic AI summary: $19</p>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent my-4"></div>
              <p className="text-4xl font-black text-teal-600 mb-2">You Pay: $24</p>
              <p className="text-sm text-gray-700">
                Professional 8-section analysis • Save $276+ • 10x better than basic summaries
              </p>
            </div>
          </InView>

          {/* Social Proof Badges */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-teal-600 mb-1">1,247+</div>
                <div className="text-sm text-gray-600">Contracts Analyzed</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">$374K+</div>
                <div className="text-sm text-gray-600">Saved in Legal Fees</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">1.8 min</div>
                <div className="text-sm text-gray-600">Avg Analysis Time</div>
              </div>
            </div>
          </InView>

        </div>
      </div>
    </div>
  );
};
