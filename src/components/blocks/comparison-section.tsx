import { InView } from "@/components/ui/in-view";
import { Check, X } from "lucide-react";

export const ComparisonSection = () => {
  const comparisons = [
    {
      feature: "Cost per contract review",
      legalDeep: "$24",
      traditional: "$300-500",
      competitor: "$49",
      legalDeepWins: true
    },
    {
      feature: "Analysis time",
      legalDeep: "2 minutes",
      traditional: "2-4 hours",
      competitor: "15 minutes",
      legalDeepWins: true
    },
    {
      feature: "Accuracy rate",
      legalDeep: "99.9%",
      traditional: "95%",
      competitor: "97%",
      legalDeepWins: true
    },
    {
      feature: "Available 24/7",
      legalDeep: true,
      traditional: false,
      competitor: true,
      legalDeepWins: false
    },
    {
      feature: "Instant reports",
      legalDeep: true,
      traditional: false,
      competitor: true,
      legalDeepWins: false
    },
    {
      feature: "Risk assessment",
      legalDeep: true,
      traditional: true,
      competitor: false,
      legalDeepWins: false
    },
    {
      feature: "Team collaboration",
      legalDeep: true,
      traditional: false,
      competitor: false,
      legalDeepWins: true
    }
  ];

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-accent mx-auto" />
      ) : (
        <X className="h-5 w-5 text-destructive mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How We Compare
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See why LegalDeep AI is the smart choice for modern legal professionals
            </p>
          </div>
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-accent text-white">
                  <th className="py-4 px-6 text-left font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center font-semibold">LegalDeep AI</th>
                  <th className="py-4 px-6 text-center font-semibold">Traditional Lawyers</th>
                  <th className="py-4 px-6 text-center font-semibold">Other AI Tools</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, index) => (
                  <tr 
                    key={item.feature}
                    className={`border-t border-border/40 ${
                      item.legalDeepWins ? 'bg-primary/5' : ''
                    } hover:bg-primary/10 transition-colors`}
                  >
                    <td className="py-4 px-6 font-medium text-foreground">{item.feature}</td>
                    <td className={`py-4 px-6 text-center ${
                      item.legalDeepWins ? 'font-bold text-primary' : 'text-foreground'
                    }`}>
                      {renderValue(item.legalDeep)}
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {renderValue(item.traditional)}
                    </td>
                    <td className="py-4 px-6 text-center text-muted-foreground">
                      {renderValue(item.competitor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InView>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            * Analysis based on industry averages and competitor research as of 2024
          </p>
        </div>
      </div>
    </section>
  );
};
