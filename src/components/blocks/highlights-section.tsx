import { Check } from "lucide-react";
import { InView } from "@/components/ui/in-view";

interface HighlightsSectionProps {
  benefits: string[];
}

export const HighlightsSection = ({ benefits }: HighlightsSectionProps) => {
  return (
    <div className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Legal Professionals Choose LegalDeep AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your legal workflow with AI-powered contract analysis that delivers results you can trust.
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1
              }}
            >
              <div className="bg-card p-6 rounded-xl border border-border shadow-[var(--card-shadow)] hover:shadow-[var(--professional-shadow)] transition-all duration-300 group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-card-foreground leading-relaxed group-hover:text-primary transition-colors duration-300">{benefit}</span>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </div>
  );
};