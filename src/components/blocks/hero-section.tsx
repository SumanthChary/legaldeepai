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
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-background min-h-screen flex items-center py-20">
      {/* Subtle gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main Headline */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] mb-6">
              Catch <span className="italic font-serif text-primary">[Contract Traps]</span>
              <br />
              Before They Cost You <span className="text-accent">$300+</span>
            </h1>
          </InView>

          {/* Subheadline */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
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
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-xl px-12 py-8 h-auto shadow-2xl hover:shadow-primary/50 transition-all rounded-2xl font-bold"
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
            <p className="text-muted-foreground text-sm mb-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                2-minute analysis
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Bank-level security
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Money-back guarantee
              </span>
            </p>
          </InView>

          {/* Value Comparison Box */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl mb-16">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Traditional Approach:</p>
                <div className="space-y-2 mb-4">
                  <p className="text-lg text-muted-foreground line-through">Lawyer consultation: $300-500</p>
                  <p className="text-lg text-muted-foreground line-through">LegalBriefAI basic summary: $19</p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-4"></div>
                <p className="text-4xl font-black text-primary mb-2">You Pay: $24</p>
                <p className="text-sm text-muted-foreground">
                  Professional 8-section analysis • Save $276+ • 10x better than basic summaries
                </p>
              </div>
            </div>
          </InView>

          {/* Social Proof Badges */}
          <InView
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-black text-primary mb-2">1,247+</div>
                <div className="text-sm text-muted-foreground font-medium">Contracts Analyzed</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-black text-accent mb-2">$374K+</div>
                <div className="text-sm text-muted-foreground font-medium">Saved in Legal Fees</div>
              </div>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-black text-primary mb-2">1.8 min</div>
                <div className="text-sm text-muted-foreground font-medium">Avg Analysis Time</div>
              </div>
            </div>
          </InView>

        </div>
      </div>
    </div>
  );
};
