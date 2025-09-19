import { InView } from "@/components/ui/in-view";
import { Building2, Scale, FileText, TrendingUp, Users, Globe } from "lucide-react";

export const TrustedBySection = () => {
  const trustMetrics = [
    {
      icon: FileText,
      metric: "50,000+",
      description: "Legal Documents Analyzed",
      detail: "Processed by legal professionals worldwide"
    },
    {
      icon: Users,
      metric: "2,500+",
      description: "Legal Professionals",
      detail: "Trust our AI-powered analysis daily"
    },
    {
      icon: Building2,
      metric: "150+",
      description: "Law Firms",
      detail: "Use LegalDeep AI for document review"
    },
    {
      icon: Globe,
      metric: "40+",
      description: "Countries",
      detail: "Legal professionals rely on our platform"
    }
  ];

  const clientTypes = [
    {
      icon: Scale,
      title: "Law Firms",
      description: "From boutique practices to AmLaw 100 firms",
      users: "Solo practitioners to 1000+ attorney firms"
    },
    {
      icon: Building2,
      title: "Corporate Legal",
      description: "In-house legal teams and compliance officers",
      users: "Fortune 500 companies and startups"
    },
    {
      icon: TrendingUp,
      title: "Legal Tech",
      description: "Legal technology companies and consultants",
      users: "Innovation-focused legal service providers"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Legal Professionals Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From solo practitioners to AmLaw 100 firms, legal professionals trust LegalDeep AI 
              to enhance their document analysis workflow and deliver superior results to their clients.
            </p>
          </div>
        </InView>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustMetrics.map((metric, index) => (
            <InView
              key={metric.description}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4">
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {metric.metric}
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  {metric.description}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.detail}
                </div>
              </div>
            </InView>
          ))}
        </div>

        {/* Client Types */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Powering Legal Excellence Across Practice Areas
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our professional platform serves diverse legal professionals with specialized features 
              tailored to their unique document analysis needs.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-3 gap-8">
          {clientTypes.map((client, index) => (
            <InView
              key={client.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-4">
                  <client.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {client.title}
                </h4>
                <p className="text-gray-600 mb-3 text-sm">
                  {client.description}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {client.users}
                </p>
              </div>
            </InView>
          ))}
        </div>

        {/* Professional Badge */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Scale className="w-4 h-4" />
              Professional Grade Platform
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              <strong>Enterprise-ready security</strong> • <strong>99.9% uptime SLA</strong> • <strong>SOC 2 Type II compliant</strong> • <strong>Legal industry focused</strong>
            </p>
          </div>
        </InView>
      </div>
    </section>
  );
};