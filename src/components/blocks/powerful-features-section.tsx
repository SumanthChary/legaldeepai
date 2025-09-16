import { InView } from "@/components/ui/in-view";
import { SkeumorphicIcon } from "@/components/ui/skeumorphic-icon";
import { FileText, Cpu, Shield, Clock, Search, Users, Sparkles, Eye, Server } from "lucide-react";

// Import feature images
import aiPoweredAnalysis from "@/assets/features/ai-powered-analysis.png";
import documentAnalysisDashboard from "@/assets/features/document-analysis-dashboard.png";
import contractRiskAssessment from "@/assets/features/contract-risk-assessment.png";
import teamCollaboration from "@/assets/features/team-collaboration.png";
import cloudIntegration from "@/assets/features/cloud-integration.png";
import documentSecurity from "@/assets/features/document-security.png";
export const PowerfulFeaturesSection = () => {
  const features = [{
    icon: Sparkles,
    title: "AI-Powered Dominance",
    description: "Make colleagues wonder how you analyze contracts so fast",
    variant: "process" as const,
    category: "AI Dominance",
    image: aiPoweredAnalysis,
    details: [
      "Advanced artificial intelligence that turns legal document review from tedious burden into competitive advantage",
      "Lightning-fast analysis that impresses clients",
      "Strategic insights that position you ahead of competitors"
    ]
  }, {
    icon: Eye,
    title: "Executive Dashboard",
    description: "Present risk assessments that make clients trust your expertise",
    variant: "result" as const,
    category: "Executive Insights", 
    image: documentAnalysisDashboard,
    details: [
      "Comprehensive insights that position you as the strategic advisor who sees what others miss",
      "Professional presentations that build client confidence",
      "Executive-level reporting that elevates your status"
    ]
  }, {
    icon: Shield,
    title: "Reputation Protection",
    description: "Never miss critical contract risks that could destroy your career",
    variant: "upload" as const,
    category: "Career Protection",
    image: contractRiskAssessment,
    details: [
      "Smart evaluation system with automated alerts that keeps you ahead of legal landmines and client disasters",
      "Career-protecting risk detection",
      "Never look unprepared in front of clients again"
    ]
  }, {
    icon: Users,
    title: "Team Collaboration",
    description: "Multi-user access with real-time collaboration and shared workspace.",
    variant: "action" as const,
    category: "Workflow",
    image: teamCollaboration,
    comingSoon: true
  }, {
    icon: Cpu,
    title: "Cloud Integration",
    description: "Seamless Google Drive sync with automated document import and management.",
    variant: "upload" as const,
    category: "Integration",
    image: cloudIntegration,
    comingSoon: true
  }, {
    icon: Server,
    title: "Document Security",
    description: "Enterprise-grade security with end-to-end encryption and compliance verification.",
    variant: "process" as const,
    category: "Security",
    image: documentSecurity
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
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
              <div className="group relative p-6 md:p-8 lg:p-10 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl backdrop-blur-sm"></div>
                
                {/* Feature Image */}
                {(feature as any).image && (
                  <div className="relative z-10 mb-6 md:mb-8 overflow-hidden rounded-2xl">
                    <img 
                      src={(feature as any).image} 
                      alt={feature.title}
                      className="block w-full h-auto rounded-2xl"
                    />
                  </div>
                )}
                
                {/* Category badge */}
                <div className="relative z-10 mb-4 md:mb-6">
                  <span className="inline-block px-3 md:px-4 py-1.5 text-sm font-medium bg-blue-100/80 text-blue-700 rounded-full border border-blue-200/50">
                    {feature.category}
                  </span>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-editorial font-light text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base lg:text-lg font-editorial font-light leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  {(feature as any).details && (
                    <ul className="space-y-1.5 sm:space-y-2">
                      {(feature as any).details.map((detail: string, detailIndex: number) => (
                        <li key={detailIndex} className="text-gray-600 flex items-start text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 sm:mt-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </InView>)}
        </div>
      </div>
    </section>;
};