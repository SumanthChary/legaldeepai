
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

type WelcomeHeaderProps = {
  session: any;
};

export const WelcomeHeader = ({ session }: WelcomeHeaderProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, organization_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('WelcomeHeader profile fetch warning:', error.message);
        // Set fallback data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({
            username: user.email?.split('@')[0] || 'User',
            email: user.email || '',
            organization_id: null
          });
        }
        return;
      }
      
      if (data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.warn('WelcomeHeader profile fetch error:', err);
      // Set fallback data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile({
          username: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          organization_id: null
        });
      }
    }
  };

  const userName = userProfile?.username || session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className="relative">
      {/* Sophisticated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-blue-50/50 rounded-2xl blur-xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-start gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0 mt-1">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-instrument bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
              Welcome back,
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-instrument bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {userName}
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-instrument ml-8 sm:ml-11 break-words">
          Here's what's happening with your documents today.
          {userProfile?.organization_id && (
            <span className="block mt-1 text-xs text-primary font-medium">
              Organization Member
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
