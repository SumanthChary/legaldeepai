
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Send, Twitter, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Send welcome email via our send-email function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: email,
          subject: "Welcome to LegalDeep AI Newsletter!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Welcome to LegalDeep AI!</h1>
              <p>Thank you for subscribing to our newsletter.</p>
              <p>You'll now receive updates about:</p>
              <ul>
                <li>New AI-powered legal features</li>
                <li>Product updates and improvements</li>
                <li>Legal technology insights</li>
                <li>Special offers and announcements</li>
              </ul>
              <p>Stay tuned for exciting updates!</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                The LegalDeep AI Team
              </p>
            </div>
          `
        }
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing! Check your email for confirmation.",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToFAQs = () => {
    const faqSection = document.querySelector('#faqs');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#faqs');
    }
  };

  return (
    <footer className="border-t bg-background w-full flex-shrink-0">
      <div className="max-w-full px-3 py-4 sm:px-4 sm:py-6 md:py-8 xl:px-8 xl:py-10">
        <div className="grid gap-3 sm:gap-4 md:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg font-semibold">Stay Connected</h3>
            <p className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm text-muted-foreground">
              Get updates on new features and releases
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 h-8 sm:h-9 md:h-10 text-xs sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                disabled={isLoading}
                type="submit"
              >
                <Send className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-pulse' : ''}`} />
              </Button>
            </form>
          </div>
          
          <div>
            <h3 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <a href="/" className="block text-muted-foreground hover:text-primary">
                Home
              </a>
              <a href="/features" className="block text-muted-foreground hover:text-primary">
                Features
              </a>
              <a href="/pricing" className="block text-muted-foreground hover:text-primary">
                Pricing
              </a>
              <a href="/support" className="block text-muted-foreground hover:text-primary">
                Support
              </a>
            </nav>
          </div>
          
          <div>
            <h3 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg font-semibold">Legal</h3>
            <nav className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <a href="/terms" className="block text-muted-foreground hover:text-primary">
                Terms & Conditions
              </a>
              <a href="/privacy" className="block text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="/security" className="block text-muted-foreground hover:text-primary">
                Security
              </a>
            </nav>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg font-semibold">Contact</h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="break-all sm:break-normal">sumanthchary.business@gmail.com</p>
              <p>+91 8125228079</p>
            </div>
          </div>
          
          <div>
            <h3 className="mb-2 sm:mb-3 md:mb-4 text-base sm:text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 sm:h-9 sm:w-9">
                <a href="https://x.com/SumanthChary07" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 sm:h-9 sm:w-9">
                <a href="https://www.instagram.com/sumanth_chary07" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 sm:h-9 sm:w-9">
                <a href="https://www.linkedin.com/in/sumanthchary" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 md:mt-6 xl:mt-8 border-t pt-3 sm:pt-4 md:pt-6 xl:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2024 LegalAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
