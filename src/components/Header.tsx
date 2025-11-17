
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo, DesktopMenu, MobileMenu, useAuthSession } from "./header";

export function Header() {
  const navigate = useNavigate();
  const { session, profile } = useAuthSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="border-b border-border/40 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <BrandLogo />
          
          <MobileMenu 
            session={session} 
            profile={profile} 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            handleSignOut={handleSignOut} 
          />
          
          <DesktopMenu 
            session={session} 
            profile={profile} 
            handleSignOut={handleSignOut} 
          />
        </div>
      </div>
    </header>
  );
}
