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
    <section className="py-20 md:py-28 bg-gradient-to-br from-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Not Just Use ChatGPT or NotebookLM?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              viewOptions={{ margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>

        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Built for Legal Professionals
            </h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              While ChatGPT and NotebookLM are great general tools, LegalDeep AI focuses specifically 
              on legal document processing with better understanding of legal structures and professional security needs.
            </p>
            <div className="text-sm text-muted-foreground font-medium">
              Trusted by legal professionals for specialized document analysis
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};
