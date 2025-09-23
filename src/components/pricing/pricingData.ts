
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Free Plan",
    price: "0",
    period: "",
    originalPrice: "",
    description: "Perfect for trying our platform",
    features: [
      "3 free document analyses",
      "Basic document summarization",
      "Risk identification highlights",
      "Email support within 48 hours",
      "Standard processing (2-5 minutes)",
      "PDF and Word document support",
      "High Level Security & Safety"
    ],
    highlight: false
  },
  {
    name: "Starter",
    price: "49",
    originalPrice: "79",
    period: "/month",
    description: "Ideal for solo practitioners",
    features: [
      "25 document analyses per month",
      "Document scanning with camera", 
      "Advanced clause highlights & risk detection",
      "Jurisdiction-specific legal insights",
      "Priority email support (24-hour response)",
      "Fast processing (under 2 minutes)",
      "Document comparison tools",
      "Analytics dashboard",
      "Export to PDF, Word, and PowerPoint",
      "Team Collaboration and Organization Settings",
      "Security Settings",
      "High Level Security & Safety"
    ],
    highlight: false
  },
  {
    name: "Pro Plan",
    price: "149",
    originalPrice: "249",
    period: "/month",
    description: "Built for growing law firms",
    features: [
      "200 document analyses per month",
      "Full API access for integrations",
      "Document scanning with camera",
      "Advanced risk scoring and insights",
      "Multi-jurisdiction compliance checks",
      "Priority support with dedicated success manager",
      "Lightning-fast processing (under 1 minute)",
      "Advanced analytics and reporting",
      "Custom contract templates and clauses",
      "Bulk document processing",
      "Priority feature requests",
      "Team Collaboration and Organization Settings",
      "Security Settings",
      "High Level Security & Safety"
    ],
    highlight: true,
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    originalPrice: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited document analyses",
      "Custom AI model training",
      "Advanced batch processing",
      "Dedicated account manager and 24/7 phone support",
      "On-premises or private cloud deployment",
      "Advanced security and compliance (HIPAA)",
      "Comprehensive analytics and business intelligence",
      "Training and onboarding for your entire team",
      "SLA guarantees and uptime commitments",
      "Custom contract review workflows",
      "Team Collaboration and Organization Settings",
      "Security Settings",
      "High Level Security & Safety"
    ],
    highlight: false
  }
];

export const getAddOns = () => [];
