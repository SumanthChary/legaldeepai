
import { PageLayout } from "@/components/layout";
import { HeroSection } from "@/components/blocks/hero-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { AboutSection } from "@/components/blocks/about-section";
import { TrustSection } from "@/components/blocks/trust-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { AboutAuthorSection } from "@/components/blocks/about-author-section";
import { TrustedBySection } from "@/components/blocks/trusted-by-section";
import { PowerfulFeaturesSection } from "@/components/blocks/powerful-features-section";
import { CompetitiveAdvantageSection } from "@/components/blocks/competitive-advantage-section";
import { WhopService } from "@/integrations/whop";
import { WhopWelcomeUpsell } from "@/components/whop";
import { useEffect, useState } from "react";

const Landing = () => {
  const [isWhopUser, setIsWhopUser] = useState(false);

  useEffect(() => {
    setIsWhopUser(WhopService.isWhopUser());
  }, []);
  const benefits = [
    "Reduce review time by 90%",
    "Improve analysis accuracy", 
    "Ensure compliance across jurisdictions",
    "Streamline team collaboration"
  ];

  const faqs = [
    {
      question: "What ROI can I expect from LegalDeep AI?",
      answer: "Legal professionals typically see 60-90% reduction in document review time, allowing them to handle 3x more cases with the same resources. Our enterprise clients report saving $50,000-200,000 annually on document analysis costs while improving accuracy and client satisfaction."
    },
    {
      question: "How does LegalDeep AI compare to NotebookLM and other AI tools?",
      answer: "Unlike generic AI tools, LegalDeep AI is trained exclusively on 10M+ legal documents, court cases, and regulatory texts. We achieve 95%+ accuracy vs 60-70% for general tools, plus we offer enterprise security, legal compliance features, and specialized legal analysis capabilities."
    },
    {
      question: "What enterprise features and security do you offer?",
      answer: "We provide SOC 2 Type II compliance, GDPR/CCPA adherence, 256-bit AES encryption, audit trails, SSO integration, data residency options, and 99.9% uptime SLA. Our platform meets AmLaw 100 security requirements with dedicated support and professional liability coverage."
    },
    {
      question: "Do you offer enterprise plans and volume discounts?",
      answer: "Yes, we offer custom enterprise plans with volume discounts, dedicated account management, priority support, custom integrations, and flexible deployment options. Contact our enterprise team for a tailored solution that fits your firm's needs and budget."
    },
    {
      question: "How does your legal-specific training improve accuracy?",
      answer: "Our AI models are trained exclusively on legal documents, understanding contract structures, legal terminology, jurisdictional differences, and regulatory frameworks. This specialized training delivers 95%+ accuracy on legal analysis compared to 60-70% for generic AI tools."
    },
    {
      question: "What types of legal documents can you analyze?",
      answer: "We handle all legal document types: contracts, agreements, M&A documents, regulatory filings, litigation materials, compliance documents, real estate transactions, intellectual property agreements, and more. Our AI understands legal context across all practice areas."
    },
    {
      question: "Can I try LegalDeep AI before committing to a paid plan?",
      answer: "Yes, we offer 3 free professional-grade document analyses so you can experience our capabilities firsthand. This allows you to test our accuracy, security, and legal-specific features before making a commitment to your firm."
    }
  ];
  
  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <PageLayout withBanner={!isWhopUser}>
        <HeroSection benefits={benefits} isWhopUser={isWhopUser} />
        <TrustedBySection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <TrustSection />
        <CompetitiveAdvantageSection />
        <div className="bg-white/90 backdrop-blur-sm">
          <TestimonialsSection />
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/50">
          <PricingSection />
        </div>
        {/* Show special Whop upsell for Whop users */}
        {isWhopUser && <WhopWelcomeUpsell />}
        <AboutAuthorSection />
        <div className="bg-gradient-to-br from-slate-50 to-gray-100/50">
          <AboutSection />
        </div>
        <div className="bg-white/90 backdrop-blur-sm">
          <FAQSection faqs={faqs} />
        </div>
      </PageLayout>
    </div>
  );
};

export default Landing;
