import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoVideo } from "@/components/blocks/demo-video";
import { InView } from "@/components/ui/in-view";
import heroMockup from "/lovable-uploads/hero-mockup-transparent.png";
interface HeroProps {
  benefits: string[];
  isWhopUser?: boolean;
}
export const HeroSection = ({
  benefits,
  isWhopUser = false
}: HeroProps) => {
  const navigate = useNavigate();
  return <div className="relative overflow-hidden bg-background min-h-screen flex items-center">
      {/* Clean, professional background */}
      <div className="absolute inset-0">
        {/* Minimal accent elements for depth */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-accent/5 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 md:w-36 md:h-36 bg-secondary/5 rounded-full"></div>
      </div>
      
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
                {/* Premium badge - special for Whop users */}
                <div className={`inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 rounded-full ${
                  isWhopUser 
                    ? 'bg-card border border-accent/20 shadow-[var(--card-shadow)]' 
                    : 'bg-card border border-accent/20 shadow-[var(--card-shadow)]'
                } backdrop-blur-sm`}>
                  <Users className={`h-3 w-3 md:h-4 md:w-4 ${isWhopUser ? 'text-accent' : 'text-accent'}`} />
                  <span className={`text-xs md:text-sm font-medium font-aeonik ${
                    isWhopUser ? 'text-primary' : 'text-primary'
                  }`}>
                    {isWhopUser ? 'Welcome from Whop! 🎉' : 'PRO - Trusted by Professionals'}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight font-aeonik tracking-tight">
                  Review 30-Page <span className="font-editorial-new italic text-accent">Contracts</span> in 12 Minutes, <span className="text-secondary">Not 2 Hours</span>
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
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl font-aeonik">
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
                  variant="default"
                  className="shadow-[var(--law-firm-shadow)] hover:shadow-[var(--hover-shadow)] transition-all duration-300 w-full sm:w-auto font-aeonik font-semibold" 
                  onClick={() => navigate("/dashboard")}
                >
                  {isWhopUser ? 'Access Your Dashboard' : 'Get Started Free'}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
                </Button>
                {!isWhopUser && (
                  <Button size="lg" variant="professional" className="transition-all duration-300 w-full sm:w-auto font-aeonik" onClick={() => navigate("/documentation")}>
                    Watch Demo
                  </Button>
                )}
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
            duration: 0.8,
            delay: 0.8
          }}>
              <div className="pt-4 md:pt-6 lg:pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 lg:p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 shadow-[var(--card-shadow)] hover:shadow-[var(--hover-shadow)]">
                      <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-accent flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-accent-foreground" />
                      </div>
                      <span className="text-xs md:text-sm lg:text-base text-foreground font-medium font-aeonik">{benefit}</span>
                    </div>)}
                </div>
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