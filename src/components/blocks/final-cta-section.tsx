import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Award } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
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
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Contract Reviews?
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8">
              Join thousands of legal professionals who save hours and catch critical risks with AI-powered analysis
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Bank-level security</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">2-minute analysis</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">99.9% accuracy</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all"
              >
                Analyze Your Contract - $24
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              >
                View All Plans
              </Button>
            </div>

            <p className="text-white/80 text-sm">
              No credit card required for first analysis • 30-day money-back guarantee
            </p>
          </div>
        </InView>
      </div>
    </section>
  );
};
