import { InView } from "@/components/ui/in-view";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Twitter, Linkedin } from "lucide-react";
export const AboutAuthorSection = () => {
  const stats = [{
    label: "Years Experience",
    value: "3+"
  }, {
    label: "Projects Built",
    value: "10+"
  }, {
    label: "Happy Clients",
    value: "50+"
  }];
  const socialLinks = [{
    icon: Twitter,
    label: "Twitter",
    url: "https://x.com/SumanthChary07"
  }, {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/sumanthchary/"
  }, {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/sumanthchary"
  }];
  return <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6
      }}>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              Meet the Creator
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-editorial font-light">
              The developer behind LegalDeep AI
            </p>
          </div>
        </InView>

        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-100 shadow-xl">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto lg:mx-0 mb-6 shadow-xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/f5d7719d-683d-4e4e-9d30-6ec4da40c974.png" 
                    alt="Sumanth Chary - Founder and CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-editorial font-light text-gray-900 mb-2 tracking-tight">
                  Sumanth Chary
                </h3>
                <p className="text-lg text-blue-600 font-editorial font-light mb-6">Founder and CEO</p>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {stats.map((stat, index) => <div key={index} className="text-center">
                      <div className="text-xl md:text-2xl font-editorial font-light text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-editorial font-light">{stat.label}</div>
                    </div>)}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="text-gray-700 text-lg md:text-xl font-editorial font-light leading-relaxed mb-8">
                  As a technology entrepreneur, I saw how manual document review was slowing down legal professionals. 
                  LegalDeep AI brings cutting-edge artificial intelligence to legal document analysis, built specifically for the modern legal practice.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link, index) => <Button key={index} variant="outline" size="lg" className="border-gray-200 hover:border-blue-200 hover:bg-blue-50 font-editorial font-light" onClick={() => window.open(link.url, '_blank')}>
                      <link.icon className="w-5 h-5 mr-3" strokeWidth={1.5} />
                      {link.label}
                      <ExternalLink className="w-4 h-4 ml-2" strokeWidth={1.5} />
                    </Button>)}
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>;
};