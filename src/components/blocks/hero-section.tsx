import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Users, Clock, Shield, TrendingDown } from "lucide-react";
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
            {/* Social Proof Counter */}
            <InView variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1,247+</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Contracts Analyzed</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$374K+</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Saved in Fees</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1.8m</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Avg Analysis</p>
                </div>
              </div>
            </InView>

            <InView variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }} transition={{ duration: 0.5 }}>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                {/* Premium badge - special for Whop users */}
                {isWhopUser && (
                  <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 backdrop-blur-sm">
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                    <span className="text-xs md:text-sm font-medium text-blue-700">
                      Welcome from Whop! 🎉
                    </span>
                  </div>
                )}
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Catch <span className="font-editorial-new italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contract Traps</span> Before They Cost You <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent font-black">$300+</span>
                </h1>
              </div>
            </InView>
            
            <InView variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }} transition={{ duration: 0.5 }}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                {isWhopUser ? 'You\'re all set! Access your premium LegalDeep AI subscription and transform your legal workflow today.' : 'Upload any contract. Get instant AI analysis. Catch hidden clauses lawyers charge $500+ to find.'}
              </p>
            </InView>
            
            <InView variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col gap-3 md:gap-4">
                {/* Dual CTAs */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 h-12 md:h-14" 
                    onClick={() => navigate("/pricing")}
                  >
                    Analyze One Contract - $24
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                  {!isWhopUser && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto text-base md:text-lg px-6 md:px-8 h-12 md:h-14 font-semibold" 
                      onClick={() => navigate("/pricing")}
                    >
                      Get Unlimited - $97/mo
                    </Button>
                  )}
                </div>

                {/* Trust line */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>2-minute analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-3 w-3 text-blue-600" />
                    </div>
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-purple-600" />
                    </div>
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>
            </InView>
            
            {/* Pricing Clarity Box */}
            <InView variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }} transition={{ duration: 0.5 }}>
              <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Traditional approach</p>
                    <p className="text-lg md:text-xl text-gray-400 line-through font-semibold">$300-500 lawyer</p>
                  </div>
                  <div className="h-8 md:h-12 w-px bg-gray-300 hidden md:block"></div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Your price today</p>
                    <p className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$24</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="px-3 py-2 bg-green-600 text-white rounded-lg text-center">
                      <p className="text-xs font-medium">Save $276+</p>
                      <p className="text-lg font-bold">92% OFF</p>
                    </div>
                  </div>
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
                      fetchPriority="high"
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