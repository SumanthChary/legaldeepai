
import { FileText, Shield, Globe, Scale, Search, ChartBar } from "lucide-react";
import { InView } from "@/components/ui/in-view";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const featuresData: Feature[] = [
  {
    icon: <FileText className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Document Summarization",
    description: "Extract key points and critical clauses with AI-powered precision"
  },
  {
    icon: <Shield className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Security & Privacy",
    description: "End-to-end encryption and regulatory compliance for your documents"
  },
  {
    icon: <Globe className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Multi-Language Support",
    description: "Summarize documents across multiple languages with translations"
  },
  {
    icon: <Scale className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Compliance Checker",
    description: "Ensure alignment with GDPR, CCPA, and HIPAA regulations"
  },
  {
    icon: <Search className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Smart Search",
    description: "Advanced search with plain-language explanations of legal jargon"
  },
  {
    icon: <ChartBar className="h-10 w-10 md:h-12 md:w-12 text-accent" />,
    title: "Analytics Dashboard",
    description: "Comprehensive metrics on time saved and document trends"
  }
];

export const FeaturesSection = () => {
  return (
    <div className="py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 md:mb-6">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive tools for efficient legal document analysis
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresData.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent/50 group">
                <div className="mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </div>
  );
};
