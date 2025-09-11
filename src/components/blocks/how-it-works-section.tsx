import { InView } from "@/components/ui/in-view";
import { ArrowRight } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [{
    image: "/lovable-uploads/87b328a8-e7d0-437f-8e6c-d49b84e25a98.png",
    title: "Scan Legal Documents",
    description: "Point, scan, and instantly detect legal document types with AI precision",
    number: "01"
  }, {
    image: "/lovable-uploads/59887f04-40af-4d2e-b9b4-6c6b13379015.png", 
    title: "AI-Powered Analysis",
    description: "Advanced legal AI analyzes risks, compliance, and generates confidence scores",
    number: "02"
  }, {
    image: "/lovable-uploads/39ad54a6-5e34-4d4c-8588-f972263f1752.png",
    title: "Actionable Legal Insights", 
    description: "Receive detailed analysis, recommendations, and export professional reports",
    number: "03"
  }];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView variants={{
          hidden: {
            opacity: 0,
            y: 30
          },
          visible: {
            opacity: 1,
            y: 0
          }
        }} transition={{
          duration: 0.6
        }}>
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              How it works 🚀 ?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-editorial font-light leading-relaxed">
              Value at every step: faster reviews, clearer decisions
            </p>
          </div>
        </InView>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <InView 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }} 
                transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }}
              >
                <div className="text-center group">
                  {/* Premium Mobile Mockup */}
                  <div className="mb-8 relative">
                    <div className="relative mx-auto max-w-[280px]">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-editorial font-medium text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-editorial font-light leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </InView>
              
              {/* Arrow between steps - visible and prominent */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-12 -right-8 z-10">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-2 shadow-md">
                    <ArrowRight className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* Mobile step connector */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center mt-8 mb-4">
                  <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-purple-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};