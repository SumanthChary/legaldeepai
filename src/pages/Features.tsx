import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Users, 
  Cloud, 
  Headphones,
  Server,
  FileSignature,
  Component,
  Database,
  Languages,
  Link,
  Sparkles,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainFeatures } from "@/components/features/MainFeatures";

import { FeatureHighlight } from "@/components/features/FeatureHighlight";
import { PreviewFeatures } from "@/components/features/PreviewFeatures";
import { WaitlistForm } from "@/components/features/WaitlistForm";

// Import feature images
import mobileContractAnalysis from "@/assets/features/mobile-contract-analysis.png";
import aiPoweredAnalysis from "@/assets/features/ai-powered-analysis.png";
import documentAnalysisDashboard from "@/assets/features/document-analysis-dashboard.png";
import contractRiskAssessment from "@/assets/features/contract-risk-assessment.png";
import teamCollaboration from "@/assets/features/team-collaboration.png";
import cloudIntegration from "@/assets/features/cloud-integration.png";
import mobileLegalAnalysis from "@/assets/features/mobile-legal-analysis.png";
import documentSecurity from "@/assets/features/document-security.png";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Mobile Contract Analysis",
      description: "Analyze legal documents anywhere with our mobile-optimized platform",
      icon: FileText,
      image: mobileContractAnalysis,
      details: [
        "Mobile-responsive interface",
        "Touch-optimized document viewer",
        "Real-time analysis on any device"
      ]
    },
    {
      title: "AI-Powered Analysis",
      description: "Advanced artificial intelligence delivers precise legal document insights",
      icon: Sparkles,
      image: aiPoweredAnalysis,
      details: [
        "87% accuracy in legal analysis",
        "Compliance verification",
        "Intelligent risk scoring"
      ]
    },
    {
      title: "Analysis Dashboard",
      description: "Comprehensive dashboard with risk assessment and compliance tracking",
      icon: Eye,
      image: documentAnalysisDashboard,
      details: [
        "Risk assessment metrics",
        "Compliance checks",
        "Confidence scoring"
      ]
    },
    {
      title: "Contract Risk Assessment",
      description: "Smart contract evaluation with color-coded risk indicators",
      icon: Shield,
      image: contractRiskAssessment,
      details: [
        "Automated risk detection",
        "Visual status indicators",
        "Issue prioritization"
      ]
    },
    {
      title: "Team Collaboration",
      description: "Collaborate seamlessly with your legal team on document analysis",
      icon: Users,
      image: teamCollaboration,
      details: [
        "Multi-user access",
        "Real-time collaboration",
        "Shared document workspace"
      ]
    },
    {
      title: "Cloud Integration",
      description: "Seamless integration with Google Drive and other cloud platforms",
      icon: Cloud,
      image: cloudIntegration,
      details: [
        "Google Drive sync",
        "Automated document import",
        "Cloud storage management"
      ]
    },
    {
      title: "Mobile Legal Analysis",
      description: "Professional legal analysis tools optimized for mobile devices",
      icon: FileSignature,
      image: mobileLegalAnalysis,
      details: [
        "Mobile risk assessment",
        "Compliance checking on-the-go",
        "Professional legal interface"
      ]
    },
    {
      title: "Document Security",
      description: "Enterprise-grade security and compliance for your legal documents",
      icon: Server,
      image: documentSecurity,
      details: [
        "End-to-end encryption",
        "Compliance verification",
        "Secure document handling"
      ]
    }
  ];
  
  const highlightedUpcomingFeatures = [
    {
      icon: FileText,
      title: "Enhanced Document Processing",
      description: "Advanced analysis capabilities for legal documents",
      status: "pro" as const,
      infoList: [
        "Improved document scanning",
        "Enhanced clause detection",
        "Better risk assessment",
        "Streamlined workflow integration"
      ]
    },
    {
      icon: Shield,
      title: "Compliance Management",
      description: "Tools to help ensure regulatory compliance",
      status: "coming-soon" as const,
      infoList: [
        "Regulatory compliance checking",
        "Policy alignment verification",
        "Automated compliance reporting",
        "Risk mitigation suggestions"
      ]
    },
    {
      icon: Component,
      title: "Document Automation",
      description: "Streamlined document creation and management",
      status: "coming-soon" as const,
      infoList: [
        "Template management system",
        "Automated document generation",
        "Custom workflow creation",
        "Integration capabilities"
      ]
    }
  ];

  const previewFeatures = [
    {
      icon: Languages,
      title: "Advanced Processing",
      description: "Enhanced capabilities for document analysis",
      status: "coming-soon" as const,
      infoList: []
    }
  ];

  return (
    <PageLayout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Legal Document Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic document processing to advanced AI-powered analysis, 
              we provide the tools you need to streamline your legal workflow
            </p>
          </div>

          <MainFeatures features={features} />
          
          <FeatureHighlight
            title="Key Upcoming Features"
            description="Get a glimpse of the innovations we're developing to enhance your legal workflow"
            features={highlightedUpcomingFeatures}
            showEnterpriseTip={true}
          />
          
          <PreviewFeatures
            title="More Innovations in Development"
            description="A preview of additional capabilities on our roadmap"
            features={previewFeatures}
          />
          
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Be First to Know About New Features
            </h2>
            <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
              Join our waitlist to get early access to upcoming features and exclusive updates about LegalDeep AI innovations.
            </p>
            <WaitlistForm />
          </div>
          
          <div className="text-center mt-8">
            <p className="mb-6 text-gray-600">
              Ready to experience our powerful document analysis capabilities?
            </p>
            <Button size="lg" onClick={() => navigate("/pricing")}>
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Features;

// File is now over 213 lines; consider refactoring into smaller components soon.
