
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Pay Per Use",
    price: "24",
    period: "/document",
    originalPrice: "",
    description: "Perfect for occasional contract reviews",
    features: [
      "Professional 8-section analysis",
      "Risk assessment with scoring",
      "Financial obligations breakdown",
      "Strategic recommendations",
      "PDF export of full report",
      "Results delivered in 2 minutes",
      "No signup required",
      "Analyze any contract type"
    ],
    highlight: false,
    badge: "Simple & Fast"
  },
  {
    name: "Pro Unlimited",
    price: isAnnual ? "970" : "97",
    originalPrice: isAnnual ? "$1,164" : "",
    period: isAnnual ? "/year" : "/month",
    description: "For businesses with ongoing contract needs",
    features: [
      "UNLIMITED contract analyses",
      "All Pay-Per-Use features included",
      "Priority processing (under 1 minute)",
      "Team collaboration tools",
      "Full API access for integrations",
      "Advanced analytics dashboard",
      "Bulk document processing",
      "Document scanning with camera",
      "Zero-storage security mode",
      "Priority email support"
    ],
    highlight: true,
    popular: true,
    badge: "Best Value"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    originalPrice: "",
    description: "Tailored solutions for large organizations",
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
    badge: "White Glove Service"
  }
];

export const getAddOns = () => [];
