import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-accent to-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Legal Document Workflow?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of legal professionals who trust our AI-powered solution
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg px-8 py-6 h-auto"
              onClick={() => navigate("/pricing")}
            >
              Choose a Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </InView>
      </div>
    </section>
  );
};
