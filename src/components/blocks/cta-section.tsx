
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-8 md:py-12 lg:py-16 xl:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-6">
            Ready to Transform Your Legal Document Workflow?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-6 lg:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust our AI-powered solution
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/pricing")}
          >
            Choose a Plan
            <Users className="ml-1.5 h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
          </Button>
        </InView>
      </div>
    </div>
  );
};
