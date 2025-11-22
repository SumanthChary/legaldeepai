
import { InView } from "@/components/ui/in-view";
import { Shield, Award, Users, Globe, CheckCircle } from "lucide-react";

export const TrustSection = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "PRO - Secure by Design",
      description: "Enterprise-grade security measures protecting your legal documents"
    },
    {
      icon: Award,
      title: "Continuously Improving",
      description: "Built with feedback from legal professionals in our pilot program"
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Trusted by legal professionals across diverse practice areas"
    },
    {
      icon: Globe,
      title: "Documents Processed Daily",
      description: "Real analyses completed by legal professionals worldwide"
    }
  ];

  const certifications = [
    "Enterprise Security",
    "Secure Data Handling",
    "Privacy-First Design",
    "Legal Document Focus",
    "Professional Grade",
    "Continuous Security Updates"
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.7 }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Trusted Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Built on Trust & Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Professional-grade platform trusted by legal professionals worldwide</p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustItems.map((item, index) => (
            <InView key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg">
                    <item.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </InView>
          ))}
        </div>

        <InView variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, delay: 0.4 }}>
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-foreground mb-4">Security & Compliance</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Highest standards of security protecting your documents</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-center p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};
