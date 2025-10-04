import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Scan, FileText, Shield, Zap, Download } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
            Available on iOS & Android
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
            LegalDoc Scan AI
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Scan, analyze, and understand legal documents instantly with the power of AI in your pocket
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button size="lg" onClick={() => setShowDownloadDialog(true)} className="gap-2 w-full sm:w-auto">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Now
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Get the App
            </Button>
          </div>

          {/* App Icon */}
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl sm:blur-3xl rounded-full"></div>
              <img 
                src={appIcon} 
                alt="LegalDoc Scan AI App Icon" 
                className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl sm:rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 px-4">
            Everything You Need in One App
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-5 sm:p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16 text-center">
          <Card className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Ready to Transform Your Legal Workflow?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of legal professionals who trust LegalDoc Scan AI for their document analysis needs
            </p>
            <Button size="lg" onClick={() => setShowDownloadDialog(true)} className="gap-2 w-full sm:w-auto">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Free App
            </Button>
          </Card>
        </section>
      </div>

      {/* Download Dialog with Blur Effect */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl">Download the App Now</DialogTitle>
            <DialogDescription className="text-base">
              Available for iOS and Android devices. Start analyzing documents instantly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Button size="lg" onClick={handleDownload} className="w-full gap-2">
              <Download className="w-5 h-5" />
              Download LegalDoc Scan AI
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Free to download • No credit card required
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default MobileApp;
