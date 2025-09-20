import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Sparkles } from "lucide-react";
export const WaitlistForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    features: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in your name and email."
      });
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address."
      });
      setIsLoading(false);
      return;
    }
    try {
      // Send waitlist confirmation email to user
      const {
        error: userEmailError
      } = await supabase.functions.invoke('send-email', {
        body: {
          to: formData.email,
          subject: "Welcome to LegalDeep AI Waitlist!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">You're on the List! 🚀</h1>
              <p>Hi ${formData.name},</p>
              <p>Thank you for joining the LegalDeep AI waitlist! We're excited to have you be part of our early access community.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">What happens next?</h3>
                <ul style="color: #374151; padding-left: 20px;">
                  <li>You'll be among the first to know about new features</li>
                  <li>Get exclusive early access to new features</li>
                  <li>Receive special launch offers and discounts</li>
                  <li>Participate in shaping our product roadmap</li>
                </ul>
              </div>

              ${formData.features ? `
                <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">Features you're interested in:</h3>
                  <p style="color: #1e3a8a; white-space: pre-wrap;">${formData.features}</p>
                </div>
              ` : ''}

              <p>Stay tuned for exciting updates!</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                The LegalDeep AI Team
              </p>
            </div>
          `
        }
      });

      // Send notification to admin
      const {
        error: adminEmailError
      } = await supabase.functions.invoke('send-email', {
        body: {
          to: "sumanthchary.business@gmail.com",
          subject: "New Waitlist Signup - LegalDeep AI",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb;">New Waitlist Signup! 🎉</h1>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                ${formData.features ? `<p><strong>Interested Features:</strong></p><p style="white-space: pre-wrap;">${formData.features}</p>` : ''}
              </div>
              <p style="color: #666; font-size: 14px;">
                Signed up from Features page waitlist
              </p>
            </div>
          `
        }
      });
      if (userEmailError || adminEmailError) {
        throw userEmailError || adminEmailError;
      }
      toast({
        title: "Welcome to the Waitlist! 🎉",
        description: "Check your email for confirmation and next steps."
      });
      setFormData({
        name: "",
        email: "",
        features: ""
      });
    } catch (error: any) {
      console.error("Waitlist signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          
          <h3 className="text-lg font-semibold">Join the Waitlist</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input placeholder="Your Name *" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required disabled={isLoading} />
          </div>
          
          <div>
            <Input type="email" placeholder="Your Email *" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required disabled={isLoading} />
          </div>
          
          <div>
            <Textarea placeholder="What features are you most excited about? (optional)" rows={3} value={formData.features} onChange={e => setFormData({
            ...formData,
            features: e.target.value
          })} disabled={isLoading} />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>;
};