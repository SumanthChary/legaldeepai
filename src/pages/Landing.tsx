
import { PageLayout } from "@/components/layout";
import { HeroSection } from "@/components/blocks/hero-section";
import { WhopWelcomeUpsell } from "@/components/whop";
import { WhopService } from "@/integrations/whop";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

const DemoSection = lazy(() => import("@/components/blocks/demo-section").then(module => ({ default: module.DemoSection })));
const TestimonialsSection = lazy(() => import("@/components/blocks/testimonials-with-marquee").then(module => ({ default: module.TestimonialsSection })));
const TrustSection = lazy(() => import("@/components/blocks/trust-section").then(module => ({ default: module.TrustSection })));
const FAQSection = lazy(() => import("@/components/blocks/faq-section").then(module => ({ default: module.FAQSection })));
const PricingSection = lazy(() => import("@/components/blocks/pricing-section").then(module => ({ default: module.PricingSection })));
const HowItWorksSection = lazy(() => import("@/components/blocks/how-it-works-section").then(module => ({ default: module.HowItWorksSection })));
const FeaturedSection = lazy(() => import("@/components/blocks/featured-section").then(module => ({ default: module.FeaturedSection })));
const PowerfulFeaturesSection = lazy(() => import("@/components/blocks/powerful-features-section").then(module => ({ default: module.PowerfulFeaturesSection })));

const Landing = () => {
  const [isWhopUser, setIsWhopUser] = useState(false);
  const sectionFallback = useMemo(() => (
    <div className="py-24 text-center text-sm text-muted-foreground">
      Loading personalized experience…
    </div>
  ), []);

  useEffect(() => {
    setIsWhopUser(WhopService.isWhopUser());
  }, []);
  const benefits = [
    "Save $300+ in lawyer fees per contract",
    "Catch hidden risks before you sign",
    "Know your obligations in plain English",
    "Share analysis with your team instantly"
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
      answer: "Every paid plan begins with a 7-day free trial. You can explore the full platform, and if it’s not a fit, cancel before the trial ends to avoid charges. After the trial, billing starts automatically with our 30-day money-back guarantee still in place."
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
    },
    {
      question: "What if I'm not satisfied?",
      answer: "100% money-back guarantee within 30 days. If our analysis doesn't provide value, we refund immediately—no questions asked. We're confident our AI will catch risks worth far more than $24."
    },
    {
      question: "How long does analysis take?",
      answer: "Average 1.8 minutes. Upload your contract → AI analyzes 8 key sections → Download comprehensive report. Most contracts are processed in under 2 minutes, day or night."
    },
    {
      question: "Do I need a subscription?",
      answer: "No subscription required. Pay $24 per contract for one-time analysis, or choose $97/mo for unlimited analyses if you review contracts regularly. No hidden fees, cancel anytime."
    },
    {
      question: "Can LegalDeep AI replace my lawyer?",
      answer: "No—and we don't try to. LegalDeep AI helps you spot risks and understand contracts faster, so you can have more productive conversations with your lawyer (or avoid lawyer fees for simple reviews). Think of it as your first line of defense."
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
        <Suspense fallback={sectionFallback}>
          <DemoSection />
          <FeaturedSection />
          <HowItWorksSection />
          <PowerfulFeaturesSection />
          <TrustSection />
          {/* Show special Whop upsell for Whop users */}
          {isWhopUser && <WhopWelcomeUpsell />}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/50">
            <PricingSection />
          </div>
          <div className="bg-white/90 backdrop-blur-sm">
            <TestimonialsSection />
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm">
            <FAQSection faqs={faqs} />
          </div>
        </Suspense>
      </PageLayout>
    </div>
  );
};

export default Landing;
