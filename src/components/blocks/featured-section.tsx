import { InView } from "@/components/ui/in-view";
import { ExternalLink } from "lucide-react";
export const FeaturedSection = () => {
  const features = [{
    name: "X",
    logo: "/lovable-uploads/1d7f8fdb-6ce9-4944-9649-6ee8c468c248.png",
    url: "https://x.com/SumanthChary07/status/1935315366219235550",
    description: "Featured on X"
  }, {
    name: "Product Hunt",
    logo: "/lovable-uploads/b48c1cae-95cb-433b-9b42-3d6407f04e3c.png",
    url: "https://www.producthunt.com/posts/postproai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-legaldeepai",
    description: "Featured Product"
  }, {
    name: "Tinylaunch",
    logo: "/lovable-uploads/496cd6d3-7d7c-444e-9989-9392a7c2da75.png",
    url: "https://tinylaun.ch/launch/3631",
    description: "Launched on Tinylaunch"
  }, {
    name: "Peerlist",
    logo: "/lovable-uploads/dc7aeeeb-c284-4751-bdac-90a8fe0ec719.png",
    url: "https://peerlist.io/sumanthdev/project/legalbrief-ai",
    description: "Showcased Project"
  }, {
    name: "Listing Cat",
    logo: "/lovable-uploads/568e8f08-4177-420c-a6c1-7586783cd416.png",
    url: "https://www.listingcat.com/",
    description: "Directory Listing"
  }];
  return <section className="py-12 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6
      }}>
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-6">Trusted &amp; Validated by People on</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {features.map((feature, index) => <InView key={feature.name} variants={{
              hidden: {
                opacity: 0,
                scale: 0.8
              },
              visible: {
                opacity: 1,
                scale: 1
              }
            }} transition={{
              duration: 0.4,
              delay: index * 0.1
            }}>
                  <a href={feature.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:bg-purple-50 transition-colors shadow-sm border border-gray-100">
                      <img src={feature.logo} alt={`${feature.name} logo`} className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      {feature.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </InView>)}
            </div>
          </div>
        </InView>
      </div>
    </section>;
};