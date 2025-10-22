import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InView } from "@/components/ui/in-view";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
interface FAQ {
  question: string;
  answer: string;
}
interface FAQSectionProps {
  faqs: FAQ[];
}
export const FAQSection = ({
  faqs
}: FAQSectionProps) => {
  const navigate = useNavigate();
  return <div className="py-12 md:py-16 lg:py-24 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6
      }}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 md:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about LegalDeep AI and how it can transform your legal document workflow
            </p>
          </div>
        </InView>

        <InView variants={{
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-gray-200 px-6 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </InView>

        {/* Integrated CTA Section */}
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          <div className="mt-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white py-12 px-8 rounded-2xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Legal Document Workflow?
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">Join Legal professionals who trust our AI-powered solution</p>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => navigate("/pricing")}>
              View Pricing
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </InView>
      </div>
    </div>;
};