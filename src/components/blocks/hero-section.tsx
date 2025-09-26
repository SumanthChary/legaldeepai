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
  return <div className="relative bg-white min-h-screen flex items-center">
      {/* Clean professional background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4 md:space-y-6 lg:space-y-8">
            <InView variants={{
            hidden: {
              opacity: 0,
              x: -40
            },
            visible: {
              opacity: 1,
              x: 0
            }
          }} transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}>
              <div className="space-y-3 md:space-y-4 lg:space-y-6">
                {/* Professional badge */}
                <div className={`inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 rounded-full ${
                  isWhopUser 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'bg-accent/10 border border-accent/20'
                }`}>
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  <span className="text-xs md:text-sm font-medium text-accent">
                    {isWhopUser ? 'Welcome from Whop! 🎉' : 'PRO - Trusted by Professionals'}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Review 30-Page <span className="font-editorial-new italic text-accent">Contracts</span> in 12 Minutes, <span className="text-primary">Not 2 Hours</span>
                </h1>
              </div>
            </InView>
            
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
            duration: 0.8,
            delay: 0.4
          }}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {isWhopUser 
                  ? 'You\'re all set! Access your premium LegalDeep AI subscription and transform your legal workflow today.' 
                  : 'Slash review time, catch hidden risks, and deliver clear answers your clients love. No setup, just upload and go.'
                }
              </p>
            </InView>
            
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
            duration: 0.8,
            delay: 0.6
          }}>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--button-shadow)] hover:shadow-[var(--professional-shadow)] transition-all duration-300 w-full sm:w-auto" 
                  onClick={() => navigate("/dashboard")}
                >
                  {isWhopUser ? 'Access Your Dashboard' : 'Get Started Free'}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
                </Button>
                {!isWhopUser && (
                  <Button size="lg" variant="outline" className="border-2 border-border hover:border-primary/20 hover:bg-muted transition-all duration-300 w-full sm:w-auto" onClick={() => navigate("/documentation")}>
                    Watch Demo
                  </Button>
                )}
              </div>
            </InView>
            
          </div>
          
          <div className="lg:col-span-7 mt-6 lg:mt-0">
            <InView variants={{
              hidden: { opacity: 0, x: 40, scale: 0.95 },
              visible: { opacity: 1, x: 0, scale: 1 }
            }} transition={{
              duration: 1,
              delay: 0.6,
              ease: [0.25, 0.1, 0.25, 1]
            }}>
              <div className="relative">
                {/* Hero dashboard mockup */}
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={heroMockup} 
                    alt="LegalDeep AI contract analysis dashboard showing risk score, compliance metrics, and suggestions"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </InView>
          </div>
        </div>
      </div>
    </div>;
};