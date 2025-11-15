
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Pay Per Use",
    price: "$24",
    period: "/document",
    description: "Perfect for occasional reviews with immediate results.",
    features: [
      "Professional 8-section analysis",
      "Risk assessment with scoring",
      "Financial obligations breakdown",
      "Strategic recommendations",
      "PDF export of full report",
      "Results delivered in 2 minutes",
      "Analyze any contract type"
    ],
    highlight: false,
    badge: "Simple & Fast",
    ctaLabel: "Buy Contract Credit",
    trialAvailable: false,
    tier: "pay_per_document"
  },
  {
    name: "Pro Unlimited",
    price: isAnnual ? "$990" : "$99",
    originalPrice: isAnnual ? "$1,188" : undefined,
    period: isAnnual ? "/year" : "/month",
    description: "Unlimited analyses with a 7-day free trial before billing.",
    features: [
      "7-day free trial – cancel anytime",
      "UNLIMITED contract analyses",
      "Priority processing (< 1 minute)",
      "Team collaboration tools",
      "Full API access",
      "Advanced analytics dashboard",
      "Bulk document processing",
      "Document scanning with camera",
      "Zero-storage security mode",
      "Priority email support"
    ],
    highlight: true,
    popular: true,
    badge: "Best Value",
    ctaLabel: "Start 7-Day Free Trial",
    trialAvailable: true,
    trialLengthDays: 7,
    tier: "professional"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored deployments with advanced compliance.",
    features: [
      "Everything in Pro Unlimited",
      "Dedicated account manager",
      "On-premises deployment option",
      "Custom AI model training",
      "HIPAA compliance",
      "SLA guarantees & uptime commitments",
      "24/7 phone support",
      "Team training & onboarding",
      "Custom integrations"
    ],
    highlight: false,
    badge: "White Glove Service",
    ctaLabel: "Book Strategy Call",
    trialAvailable: false,
    tier: "enterprise"
  }
];

export const getAddOns = () => [];
