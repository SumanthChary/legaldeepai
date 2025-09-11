import { InView } from "@/components/ui/in-view";
import { SkeumorphicIcon } from "@/components/ui/skeumorphic-icon";
import { FileText, Cpu, Shield, Clock, Search, Users } from "lucide-react";
export const PowerfulFeaturesSection = () => {
  const features = [{
    icon: Search,
    title: "Risk & Clause Detection",
    description: "Spot hidden risks, obligations, and renewal traps before they cost you.",
    variant: "process" as const,
    category: "AI Analysis"
  }, {
    icon: Clock,
    title: "90% Faster Reviews",
    description: "Ship decisions in minutes and reclaim billable hours.",
    variant: "action" as const,
    category: "Performance"
  }, {
    icon: FileText,
    title: "One‑Click Summaries",
    description: "Export clean briefs your clients actually understand.",
    variant: "result" as const,
    category: "Output"
  }, {
    icon: Shield,
    title: "Privacy by Default",
    description: "Your documents stay protected with enterprise‑grade controls.",
    variant: "upload" as const,
    category: "Security"
  }, {
    icon: Users,
    title: "Collaboration",
    description: "Assign, comment, and align as a team.",
    variant: "action" as const,
    category: "Workflow",
    comingSoon: true
  }, {
    icon: Cpu,
    title: "Cloud Integrations",
    description: "Connect with your drive and DMS.",
    variant: "upload" as const,
    category: "Integration",
    comingSoon: true
  }];
  return <section className="py-20 md:py-28 lg:py-32 bg-white">
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
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">Powerful Features for Legal Professionals</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-editorial font-light leading-relaxed">
              Everything you need to transform your legal document workflow
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => <InView key={index} variants={{
          hidden: {
            opacity: 0,
            y: 30,
            rotateX: 15
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0
          }
        }} transition={{
          duration: 0.8,
          delay: index * 0.15,
          ease: [0.25, 0.1, 0.25, 1]
        }}>
              <div className="group relative p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl backdrop-blur-sm"></div>
                
                {/* Category badge */}
                <div className="relative z-10 mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100/80 text-blue-700 rounded-full border border-blue-200/50">
                    {feature.category}
                  </span>
                </div>
                
                {/* 3D Icon */}
                <div className="relative z-10 mb-8 flex justify-start">
                  <SkeumorphicIcon icon={feature.icon} variant={feature.variant} size="md" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl md:text-2xl font-editorial font-light text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    {'comingSoon' in feature && (feature as any).comingSoon && <div className="relative">
                        <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200/50 font-medium">
                          Coming Soon
                        </span>
                      </div>}
                  </div>
                  <p className="text-gray-600 text-base md:text-lg font-editorial font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </InView>)}
        </div>
      </div>
    </section>;
};