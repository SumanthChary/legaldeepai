import { InView } from "@/components/ui/in-view";
import { ExternalLink, Star } from "lucide-react";

export const FeaturedSection = () => {
  const features = [
    {
      name: "X",
      logo: "/lovable-uploads/1d7f8fdb-6ce9-4944-9649-6ee8c468c248.png",
      url: "https://x.com/SumanthChary07/status/1935315366219235550",
      description: "Featured on X"
    },
    {
      name: "Product Hunt",
      logo: "/lovable-uploads/b48c1cae-95cb-433b-9b42-3d6407f04e3c.png",
      url: "https://www.producthunt.com/posts/postproai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-legaldeepai",
      description: "Featured Product"
    },
    {
      name: "Tinylaunch",
      logo: "/lovable-uploads/496cd6d3-7d7c-444e-9989-9392a7c2da75.png",
      url: "https://tinylaun.ch/launch/3631",
      description: "Launched on Tinylaunch"
    },
    {
      name: "Peerlist",
      logo: "/lovable-uploads/dc7aeeeb-c284-4751-bdac-90a8fe0ec719.png",
      url: "https://peerlist.io/sumanthdev/project/legalbrief-ai",
      description: "Showcased Project"
    },
    {
      name: "LinkedIn",
      logo: "/lovable-uploads/linkedin-logo.png",
      url: "https://www.linkedin.com/company/107756392",
      description: "Company Profile"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">Trusted by the Community</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Across Platforms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recognized and validated by professionals worldwide
            </p>
          </div>
        </InView>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {features.map((feature, index) => (
            <InView
              key={feature.name}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <a
                href={feature.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-sm">
                    <img
                      src={feature.logo}
                      alt={`${feature.name} logo`}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                      decoding="async"
                      width={256}
                      height={256}
                    />
                  </div>
                  <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.name}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3" />
                </div>
              </a>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};