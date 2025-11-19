import { InView } from "@/components/ui/in-view";
import { ArrowRight, Sparkles } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      image: "/lovable-uploads/87b328a8-e7d0-437f-8e6c-d49b84e25a98.png",
      title: "Upload Document",
      description: "Securely upload any legal document in seconds with our simple drag-and-drop interface",
      number: "01"
    },
    {
      image: "/lovable-uploads/59887f04-40af-4d2e-b9b4-6c6b13379015.png",
      title: "AI Analysis",
      description: "Our advanced AI analyzes every clause, identifies risks, and extracts key insights instantly",
      number: "02"
    },
    {
      image: "/lovable-uploads/39ad54a6-5e34-4d4c-8588-f972263f1752.png",
      title: "Get Insights",
      description: "Review comprehensive analysis with actionable recommendations and export professional reports",
      number: "03"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to transform your legal document workflow
            </p>
          </div>
        </InView>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <InView
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15
                }}
              >
                <div className="text-center group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="mb-8 mt-8 relative">
                    <div className="relative mx-auto max-w-[300px] rounded-3xl overflow-hidden shadow-2xl border border-border group-hover:shadow-primary/20 transition-all duration-500 group-hover:scale-105">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto"
                        loading="lazy"
                        decoding="async"
                        width={1024}
                        height={1536}
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </InView>
              
              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-16 -right-8 lg:-right-12 z-20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg animate-pulse">
                    <ArrowRight className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};