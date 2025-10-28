import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoVideo } from "@/components/blocks/demo-video";
import { InView } from "@/components/ui/in-view";
import heroMockup from "@/assets/hero-dashboard-mockup.png";
interface HeroProps {
  benefits: string[];
  isWhopUser?: boolean;
}
export const HeroSection = ({
  benefits,
  isWhopUser = false
}: HeroProps) => {
  const navigate = useNavigate();
  return <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen flex items-center">
      {/* Clean background - no animations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4 md:space-y-6 lg:space-y-8">
            <InView variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1
            }
          }} transition={{
            duration: 0.5
          }}>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                {/* Premium badge - special for Whop users */}
                <div className={`inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 rounded-full ${isWhopUser ? 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50' : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50'} backdrop-blur-sm`}>
                  <Users className={`h-3 w-3 md:h-4 md:w-4 ${isWhopUser ? 'text-blue-600' : 'text-green-600'}`} />
                  <span className={`text-xs md:text-sm font-medium ${isWhopUser ? 'text-blue-700' : 'text-green-700'}`}>
                    {isWhopUser ? 'Welcome from Whop! 🎉' : 'PRO - Trusted by Professionals'}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Review 30-Page <span className="font-editorial-new italic text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contracts</span> in 12 Minutes, <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Not 2 Hours</span>
                </h1>
              </div>
            </InView>
            
            <InView variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1
            }
          }} transition={{
            duration: 0.5
          }}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                {isWhopUser ? 'You\'re all set! Access your premium LegalDeep AI subscription and transform your legal workflow today.' : 'Slash review time, catch hidden risks, and deliver clear answers your clients love. No setup, just upload and go.'}
              </p>
            </InView>
            
            <InView variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1
            }
          }} transition={{
            duration: 0.5
          }}>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full sm:w-auto" onClick={() => navigate(isWhopUser ? "/dashboard" : "/pricing")}>
                  {isWhopUser ? 'Access Your Dashboard' : 'View Pricing'}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
                </Button>
                {!isWhopUser && <Button size="lg" variant="outline" className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto" onClick={() => navigate("/mobile-app")}>
                    Download App
                  </Button>}
              </div>
            </InView>
            
            <InView variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1
            }
          }} transition={{
            duration: 0.5
          }}>
              <div className="pt-4 md:pt-6 lg:pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 lg:p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300">
                      <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-white" />
                      </div>
                      <span className="text-xs md:text-sm lg:text-base text-gray-700 font-medium">{benefit}</span>
                    </div>)}
                </div>
              </div>
            </InView>
          </div>
          
          <div className="lg:col-span-7 mt-6 lg:mt-0">
            <InView variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1
            }
          }} transition={{
            duration: 0.5
          }}>
              <div className="relative">
                {/* Hero dashboard mockup */}
                <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={heroMockup}
                      alt="LegalDeep AI contract analysis dashboard showing risk score, compliance metrics, and suggestions"
                      className="w-full h-auto object-cover"
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                      width={1536}
                      height={1024}
                    />
                </div>
              </div>
            </InView>
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="mt-12 lg:mt-20">
          <p className="text-center text-sm text-muted-foreground mb-6">Inspired and Improved by</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              <img src="/logos/aba-logo.png" alt="ABA" className="h-10 md:h-12 w-auto opacity-50 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-300" loading="lazy" decoding="async" width={384} height={256} />
              <img src="/logos/microsoft-azure-logo.png" alt="Microsoft Azure" className="h-10 md:h-12 w-auto opacity-50 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-300" loading="lazy" decoding="async" width={384} height={256} />
              <img src="/logos/docusign-logo.png" alt="DocuSign" className="h-10 md:h-12 w-auto opacity-50 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-300" loading="lazy" decoding="async" width={384} height={256} />
              <img src="/logos/adobe-sign-logo.png" alt="Adobe Sign" className="h-10 md:h-12 w-auto opacity-50 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-300" loading="lazy" decoding="async" width={384} height={256} />
              <img src="/logos/iso-27001-logo.png" alt="ISO 27001 Certified" className="h-10 md:h-12 w-auto opacity-50 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-300" loading="lazy" decoding="async" width={384} height={256} />
          </div>
        </div>
      </div>
    </div>;
};