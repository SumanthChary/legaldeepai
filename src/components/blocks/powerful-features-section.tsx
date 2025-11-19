import { InView } from "@/components/ui/in-view";
import type { LucideIcon } from "lucide-react";
import { Cpu, Shield, Users, Sparkles, Eye, Server } from "lucide-react";
import aiPoweredAnalysis from "@/assets/features/ai-powered-analysis.png";
import documentAnalysisDashboard from "@/assets/features/document-analysis-dashboard.png";
import contractRiskAssessment from "@/assets/features/contract-risk-assessment.png";
import teamCollaboration from "@/assets/features/team-collaboration.png";
import cloudIntegration from "@/assets/features/cloud-integration.png";
import documentSecurity from "@/assets/features/document-security.png";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  image?: string;
  details?: string[];
  comingSoon?: boolean;
};

export const PowerfulFeaturesSection = () => {
  const features: Feature[] = [
    { icon: Sparkles, title: "AI-Powered Analysis", description: "Advanced AI transforming legal documents into clear insights", image: aiPoweredAnalysis, details: ["Lightning-fast processing", "Intelligent detection", "Risk assessment"] },
    { icon: Eye, title: "Executive Dashboard", description: "Professional analytics and complete visibility", image: documentAnalysisDashboard, details: ["Real-time analytics", "Custom reporting", "Performance metrics"] },
    { icon: Shield, title: "Risk Assessment", description: "Comprehensive evaluation with automated alerts", image: contractRiskAssessment, details: ["Automated detection", "Compliance checking", "Critical alerts"] },
    { icon: Users, title: "Team Collaboration", description: "Multi-user access with real-time collaboration", image: teamCollaboration, comingSoon: true, details: ["Real-time collaboration", "Role-based access", "Shared workspaces"] },
    { icon: Cpu, title: "Cloud Integration", description: "Seamless integration with cloud platforms", image: cloudIntegration, comingSoon: true, details: ["Google Drive sync", "Auto-import", "Cloud storage"] },
    { icon: Server, title: "Enterprise Security", description: "Bank-grade security with encryption", image: documentSecurity, details: ["End-to-end encryption", "SOC 2 compliance", "Data protection"] }
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7 }}>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Professional-grade tools for legal excellence</p>
          </div>
        </InView>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <InView key={index} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="group relative h-full">
                <div className="h-full bg-card rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                  {feature.image && (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                      <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      {feature.comingSoon && <div className="absolute top-4 right-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">Coming Soon</div>}
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    {feature.details && (
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};
