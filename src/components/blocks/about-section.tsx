import { InView } from "@/components/ui/in-view";
import { Shield, Users, Award, Zap } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with international data protection standards"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Legal professionals and AI experts working together to deliver cutting-edge solutions"
    },
    {
      icon: Award,
      title: "Professional Development",
      description: "Built with insights from legal professionals and continuous improvement"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process documents in seconds with our advanced AI technology"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About LegalDeep AI
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              LegalDeep AI is a professional-grade platform founded by Sumanth Chary to help legal professionals analyze documents more efficiently. We've built a robust solution trusted by legal practitioners worldwide.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground">PROVEN RESULTS:</strong> Our platform has successfully processed thousands of documents for legal professionals, delivering consistent accuracy and reliability. We continuously enhance our capabilities based on real-world usage and professional feedback.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </InView>
          ))}
        </div>

        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-card to-primary/5 rounded-3xl p-8 md:p-12 shadow-xl border border-border">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                To provide a reliable, professional-grade AI tool for legal document analysis that delivers consistent results and empowers legal professionals to work more efficiently. Trusted by solo practitioners, law firms, and legal departments worldwide.
              </p>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};
