import { Shield, Zap, Target, Lock, BookOpen, Users } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const CompetitiveAdvantageSection = () => {
  const advantages = [
    {
      icon: Target,
      title: "Legal-Specific Training",
      description: "Unlike general AI tools like NotebookLM, LegalDeep AI is trained exclusively on legal documents and jurisprudence.",
      detail: "Our models understand legal terminology, contract structures, and regulatory frameworks."
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Bank-level encryption and compliance with legal industry standards ensure your sensitive documents stay protected.",
      detail: "GDPR compliant with advanced data protection protocols specifically designed for legal practices."
    },
    {
      icon: Zap,
      title: "Superior Accuracy",
      description: "Specialized legal training delivers 95%+ accuracy on legal document analysis compared to generic AI tools.",
      detail: "Trained on millions of legal documents, court cases, and regulatory texts for unmatched precision."
    },
    {
      icon: Lock,
      title: "Professional Compliance",
      description: "Built for legal professionals with features that ensure confidentiality and professional standards.",
      detail: "Audit trails, version control, and professional-grade reporting capabilities."
    },
    {
      icon: BookOpen,
      title: "Legal Context Understanding",
      description: "Goes beyond simple text analysis to understand legal implications, precedents, and jurisdictional differences.",
      detail: "Contextual analysis that considers legal precedents and cross-references regulatory requirements."
    },
    {
      icon: Users,
      title: "Purpose-Built for Legal Teams",
      description: "Designed specifically for legal workflows, not adapted from general-purpose tools.",
      detail: "Features like clause extraction, risk assessment, and compliance checking built from the ground up."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
          }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Why Choose LegalDeep AI
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Beyond NotebookLM and Generic AI Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While general AI tools provide basic document analysis, LegalDeep AI is purpose-built for legal professionals 
              with specialized training, enterprise security, and legal-specific features.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <InView
              key={advantage.title}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" }
              }}
              viewOptions={{ margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <advantage.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {advantage.description}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {advantage.detail}
                </p>
              </div>
            </InView>
          ))}
        </div>

        <InView
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
          }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              The Difference is in the Training
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              LegalDeep AI has been trained on over 10 million legal documents, court cases, and regulatory texts. 
              This specialized training means we understand legal nuances that generic AI tools simply miss.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">10M+</div>
                <div className="text-blue-100">Legal Documents Trained On</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">95%+</div>
                <div className="text-blue-100">Analysis Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-100">Legal Professional Focus</div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};