import { InView } from "@/components/ui/in-view";

export const TrustedBySection = () => {
  // Professional law firm and legal tech company logos (grayscale treatment)
  const trustedLogos = [
    { name: "Baker McKenzie", width: "140", height: "40" },
    { name: "DLA Piper", width: "120", height: "40" },
    { name: "Norton Rose", width: "130", height: "40" },
    { name: "Clifford Chance", width: "150", height: "40" },
    { name: "Freshfields", width: "140", height: "40" },
    { name: "Linklaters", width: "130", height: "40" },
  ];

  return (
    <div className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8 md:mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Trusted by Legal Professionals Worldwide
            </p>
            <h3 className="text-lg md:text-xl text-foreground">
              Join thousands of legal professionals who trust LegalDeep AI
            </h3>
          </div>
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
            {trustedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                {/* Placeholder for actual logos - using styled text for now */}
                <div 
                  className="text-center font-medium text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                  style={{ width: logo.width + "px", height: logo.height + "px" }}
                >
                  <div className="flex items-center justify-center h-full border border-border/30 rounded-lg px-3 py-2 hover:border-primary/20 transition-colors duration-300">
                    {logo.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InView>

        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mt-8 md:mt-12">
            <p className="text-sm text-muted-foreground">
              Over <span className="font-semibold text-accent">10,000+</span> legal professionals trust LegalDeep AI for their contract analysis needs
            </p>
          </div>
        </InView>
      </div>
    </div>
  );
};