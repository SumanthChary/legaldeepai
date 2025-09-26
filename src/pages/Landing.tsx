
import { PageLayout } from "@/components/layout";
import { HeroSection } from "@/components/blocks/hero-section";
import { HighlightsSection } from "@/components/blocks/highlights-section";
import { TrustedBySection } from "@/components/blocks/trusted-by-section";
import { DemoSection } from "@/components/blocks/demo-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { AboutSection } from "@/components/blocks/about-section";
import { TrustSection } from "@/components/blocks/trust-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { AboutAuthorSection } from "@/components/blocks/about-author-section";
import { FeaturedSection } from "@/components/blocks/featured-section";
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
      question: "What is LegalDeep AI?",
      answer: "LegalDeep AI is a professional-grade AI-powered platform designed to help legal professionals analyze and summarize legal documents efficiently. Our mature platform is trusted by legal practitioners worldwide for accurate, reliable document analysis."
    },
    {
      question: "How secure is my data on LegalDeep AI?",
      answer: "We maintain enterprise-grade security with advanced encryption and secure data handling practices. Our platform follows industry-leading security standards and compliance protocols to protect your sensitive legal documents."
    },
    {
      question: "What types of documents can LegalDeep AI process?",
      answer: "Our professional platform can process a wide variety of legal documents including contracts, agreements, legal briefs, and regulatory documents. We've successfully analyzed thousands of documents and continue to expand our capabilities."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer 3 free document analyses so you can experience our professional platform firsthand. This allows you to test our capabilities and see the quality of our AI-powered legal document analysis."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our professional platform delivers consistently high accuracy in document analysis. While we continuously improve our AI models, we recommend using our analysis as a powerful tool to enhance your professional legal judgment and workflow efficiency."
    },
    {
      question: "Can I integrate LegalDeep AI with my existing workflow?",
      answer: "Our professional platform is designed for seamless integration with existing legal workflows. We offer robust document processing capabilities with plans to expand integration features based on user needs and industry standards."
    },
    {
      question: "How is LegalDeep AI different from ChatGPT or NotebookLM?",
      answer: "While general AI tools like ChatGPT and NotebookLM can read documents, LegalDeep AI is specifically designed for legal work. We focus on understanding legal document structures, maintaining professional security standards, and providing features tailored to legal workflows rather than general document analysis."
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
    <div className="bg-white">
      <PageLayout withBanner={!isWhopUser}>
        <HeroSection benefits={benefits} isWhopUser={isWhopUser} />
        <HighlightsSection benefits={benefits} />
        <TrustedBySection />
        <DemoSection />
        <FeaturedSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <CompetitiveAdvantageSection />
        <TrustSection />
        {/* Show special Whop upsell for Whop users */}
        {isWhopUser && <WhopWelcomeUpsell />}
        <div className="bg-muted/30">
          <PricingSection />
        </div>
        <div className="bg-white">
          <TestimonialsSection />
        </div>
        <AboutAuthorSection />
        <div className="bg-muted/30">
          <AboutSection />
        </div>
        <div className="bg-white">
          <FAQSection faqs={faqs} />
        </div>
      </PageLayout>
    </div>
  );
};

export default Landing;
