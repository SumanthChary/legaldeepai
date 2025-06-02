
import { InView } from "@/components/ui/in-view";
import { Shield, Award, Users, Globe, CheckCircle } from "lucide-react";

export const TrustSection = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "SOC 2 Compliant",
      description: "Certified for security, availability, and confidentiality"
    },
    {
      icon: Award,
      title: "ISO 27001 Certified",
      description: "International standard for information security management"
    },
    {
      icon: Users,
      title: "10,000+ Users",
      description: "Trusted by legal professionals worldwide"
    },
    {
      icon: Globe,
      title: "99.9% Uptime",
      description: "Reliable service with enterprise-grade infrastructure"
    }
  ];

  const certifications = [
    "GDPR Compliant",
    "HIPAA Ready",
    "SOC 2 Type II",
    "ISO 27001",
    "PCI DSS",
    "CCPA Compliant"
  ];

  return (
    <div className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6">
              Trusted by Legal Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              LegalBriefAI meets the highest standards of security, compliance, and reliability. 
              Your sensitive legal data is protected with enterprise-grade security measures.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustItems.map((item, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </InView>
          ))}
        </div>

        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Compliance</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We maintain the highest standards of data protection and regulatory compliance 
                to ensure your legal documents are always secure.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {certifications.map((cert, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};
