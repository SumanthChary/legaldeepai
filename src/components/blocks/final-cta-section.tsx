import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 py-16 md:py-20 lg:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Ready to Protect Your Business?
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto">
              Join 1,247+ professionals who caught contract risks before they hit.
            </p>

            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-base md:text-lg px-8 md:px-12 h-14 md:h-16 font-bold border-0"
              onClick={() => navigate("/pricing")}
            >
              Analyze Your Contract - $24
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Trust line */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8 text-sm md:text-base text-white/80">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 md:h-5 md:w-5" />
                <span>2-minute analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 md:h-5 md:w-5" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 md:h-5 md:w-5" />
                <span>Auto-deleted</span>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};
