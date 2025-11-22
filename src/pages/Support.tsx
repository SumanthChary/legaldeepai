import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Send, MessageCircle } from "lucide-react";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: "sumanthchary.business@gmail.com",
          subject: `Support Request: ${formData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: hsl(173, 80%, 40%);">New Support Request</h1>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
              </div>
              <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h3>Message:</h3>
                <p style="white-space: pre-wrap;">${formData.message}</p>
              </div>
            </div>
          `,
          replyTo: formData.email
        }
      });

      if (error) throw error;

      await supabase.functions.invoke('send-email', {
        body: { 
          to: formData.email,
          subject: "We received your support request",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: hsl(173, 80%, 40%);">Thank you for contacting us!</h1>
              <p>Hi ${formData.name},</p>
              <p>We have received your support request and will get back to you as soon as possible.</p>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Your request:</strong></p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong> ${formData.message}</p>
              </div>
              <p>Our typical response time is within 24 hours during business days.</p>
            </div>
          `
        }
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Support form error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-background via-primary/5 to-accent/5 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact & Support</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Have questions or need help? We're here for you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-xl border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="h-6 w-6 text-primary" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    type="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Input
                    placeholder="Subject *"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Textarea
                    placeholder="Your message *"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-xl border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">Get help via email</p>
                  <a 
                    href="mailto:sumanthchary.business@gmail.com" 
                    className="text-primary hover:underline font-medium text-lg"
                  >
                    sumanthchary.business@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Phone className="h-5 w-5 text-primary" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">Call us for urgent matters</p>
                  <p className="font-bold text-lg text-foreground">+91 8125228079</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Monday - Friday, 9 AM - 6 PM IST
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-border bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Check our FAQ section for quick answers to common questions.
                  </p>
                  <Button variant="outline" asChild size="lg">
                    <a href="/#faqs">View FAQs</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Support;
