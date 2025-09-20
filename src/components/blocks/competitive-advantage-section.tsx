import { Check } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const CompetitiveAdvantageSection = () => {
  const advantages = [
    {
      title: "Legal-Focused Analysis",
      description: "Specialized for legal document processing, unlike general tools like NotebookLM or ChatGPT."
    },
    {
      title: "Professional Security",
      description: "Enterprise-grade encryption designed for confidential legal documents."
    },
    {
      title: "Document Structure Understanding",
      description: "Recognizes legal document formats, clauses, and standard legal language patterns."
    },
    {
      title: "Compliance Features",
      description: "Built with legal workflow requirements and professional standards in mind."
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
              <Check className="w-4 h-4" />
              Why Choose LegalDeep AI
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Not Just Use ChatGPT or NotebookLM?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While generic AI tools can read documents, LegalDeep AI is built specifically for legal work 
              with better document structure understanding and professional security standards.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600">
                      {advantage.description}
                    </p>
                  </div>
                </div>
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
          <div className="bg-blue-50 rounded-xl p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Built for Legal Professionals
            </h3>
            <p className="text-gray-700 mb-6">
              While ChatGPT and NotebookLM are great general tools, LegalDeep AI focuses specifically 
              on legal document processing with better understanding of legal structures and professional security needs.
            </p>
            <div className="text-sm text-gray-600">
              Trusted by legal professionals for specialized document analysis
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};