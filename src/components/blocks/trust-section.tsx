
import { InView } from "@/components/ui/in-view";
import { Shield, Award, Users, Globe, CheckCircle } from "lucide-react";

export const TrustSection = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "SOC 2 Type II compliant with 256-bit AES encryption and zero-trust architecture"
    },
    {
      icon: Award,
      title: "99.9% Uptime SLA",
      description: "Enterprise-grade infrastructure with guaranteed availability for critical legal work"
    },
    {
      icon: Users,
      title: "Professional Support",
      description: "Dedicated support team with legal industry expertise and priority response"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "GDPR, CCPA, and legal industry compliance standards across all jurisdictions"
    }
  ];

  const certifications = [
    "SOC 2 Type II Certified",
    "GDPR & CCPA Compliant",
    "ISO 27001 Standards",
    "Legal Bar Approved",
    "Enterprise SSO Ready",
    "Audit Trail Enabled",
    "Data Residency Options",
    "Professional Liability Coverage"
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
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built specifically for legal professionals who demand the highest levels of security, compliance, 
              and reliability. Our enterprise infrastructure meets the stringent requirements of law firms and legal departments.
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Certifications & Standards</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform meets and exceeds the security and compliance requirements expected by 
                AmLaw 100 firms, corporate legal departments, and regulatory bodies worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
