import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Scan, FileText, Shield, Zap, Download, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import appIcon from "@/assets/app-icon.png";

const MobileApp = () => {
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const appDownloadUrl = "https://bit.ly/LegalDoc-ScannerApp";

  const features = [
    {
      icon: Scan,
      title: "Smart Document Scanning",
      description: "Capture documents with your phone camera and get instant AI-powered analysis"
    },
    {
      icon: FileText,
      title: "Instant Legal Analysis",
      description: "Get comprehensive legal document insights in seconds, anywhere you are"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Your documents are encrypted end-to-end with bank-level security"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process documents 10x faster than traditional methods with offline capability"
    }
  ];

  const handleDownload = () => {
    window.open(appDownloadUrl, "_blank");
  };

  return (
    <PageLayout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-20 text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Available on iOS & Android</span>
              <Star className="w-4 h-4 text-primary fill-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 px-4">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                LegalDoc Scan AI
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 mb-8 sm:mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
              Scan, analyze, and understand legal documents instantly with the power of AI in your pocket
            </p>

            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 sm:mb-20 px-4">
              <Button 
                size="lg" 
                onClick={() => setShowDownloadDialog(true)} 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-300 w-full sm:w-auto px-8 py-6 text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDownload} 
                className="group border-2 hover:bg-primary/5 backdrop-blur-sm w-full sm:w-auto px-8 py-6 text-base"
              >
                <Smartphone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get the App
              </Button>
            </div>

            {/* Premium App Icon Display */}
            <div className="flex justify-center mb-16 sm:mb-24 px-4">
              <div className="relative group">
                {/* Glow Effects */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-3xl group-hover:blur-[100px] transition-all duration-500"></div>
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                
                {/* Glass Card Container */}
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-background/80 to-background/40 p-8 rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
                  <img 
                    src={appIcon} 
                    alt="LegalDoc Scan AI App Icon" 
                    className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-[2rem] shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Rating Badge */}
                  <div className="absolute -bottom-4 -right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-background to-background/95 border border-primary/20 shadow-lg backdrop-blur-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">4.9</span>
                    <span className="text-xs text-muted-foreground">Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Features Section */}
          <section className="container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Everything You Need in One App
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Professional-grade legal analysis at your fingertips
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative p-8 hover:shadow-[0_8px_40px_rgba(var(--primary),0.12)] transition-all duration-300 border-muted/40 backdrop-blur-sm bg-gradient-to-br from-background/95 to-background/80 overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon Container */}
                  <div className="relative mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="relative text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="relative text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Premium CTA Section */}
          <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl"></div>
              
              <Card className="relative backdrop-blur-xl bg-gradient-to-br from-background/95 via-primary/5 to-background/95 p-8 sm:p-12 md:p-16 border border-primary/20 shadow-[0_8px_40px_rgba(var(--primary),0.15)] overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    Ready to Transform Your Legal Workflow?
                  </h2>
                  <p className="text-lg sm:text-xl text-muted-foreground/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of legal professionals who trust LegalDoc Scan AI for their document analysis needs
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      size="lg" 
                      onClick={() => setShowDownloadDialog(true)} 
                      className="group bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] w-full sm:w-auto px-8 py-6 text-base"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Companion App
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>4.9/5 from 2,000+ reviews</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>

      {/* Premium Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-background/95 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Download the App Now
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground/80 mt-2">
              Available for iOS and Android devices. Start analyzing documents instantly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-6">
            <Button 
              size="lg" 
              onClick={handleDownload} 
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] py-6 text-base group"
            >
              <Download className="w-5 h-5" />
              Download LegalDoc Scan AI
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">4.9</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
                <span className="text-sm text-muted-foreground">Included with active subscription</span>
              <div className="h-4 w-px bg-border"></div>
                <span className="text-sm text-muted-foreground">Secure mobile access</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default MobileApp;
