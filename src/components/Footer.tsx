
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
      const { error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: email,
          subject: "Welcome to LegalDeep AI Newsletter!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #0D9488; text-align: center;">Welcome to LegalDeep AI!</h1>
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
    <footer className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-white to-accent/5 w-full flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-foreground">Stay Connected</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get updates on new features and legal tech insights
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-9 w-9 bg-primary hover:bg-primary/90"
                disabled={isLoading}
                type="submit"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/documentation" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="/api" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><button onClick={scrollToFAQs} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </button></li>
              <li><a href="/support" className="text-muted-foreground hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LegalDeep AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
