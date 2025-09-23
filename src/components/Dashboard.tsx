
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivitySummary } from "./dashboard/ActivitySummary";
import { ContentTabs } from "./dashboard/ContentTabs";
import { LimitNotification } from "./dashboard/LimitNotification";
import { DonationDialog } from "./dashboard/DonationDialog";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [analysisStats, setAnalysisStats] = useState({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    });

    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
        
        // Special handling for enjoywithpandu@gmail.com - always unlimited, never show upgrade banner
        if (data.email === 'enjoywithpandu@gmail.com') {
          setShowUpgradeBanner(false);
          return;
        }
        
        // For other users, only show upgrade banner if they have limited documents and are near limit
        const hasLimitedAccess = data.document_limit < 500;
        const isNearLimit = data.document_count >= (data.document_limit * 0.8);
        setShowUpgradeBanner(hasLimitedAccess && isNearLimit);
      }
    };

    const fetchAnalysisStats = async () => {
      if (!session?.user?.id) return;

      const { data: analyses, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      const hasAnalysesWithSummary = analyses?.some(analysis => analysis.summary);
      const lastDonationPrompt = localStorage.getItem('lastDonationPrompt');
      const now = new Date().getTime();
      const showAfterDays = 7; // Show dialog every 7 days if feature is used

      if (hasAnalysesWithSummary && 
          (!lastDonationPrompt || (now - parseInt(lastDonationPrompt)) > (showAfterDays * 24 * 60 * 60 * 1000))) {
        setShowDonationDialog(true);
        localStorage.setItem('lastDonationPrompt', now.toString());
      }

      setAnalysisStats({
        totalDocuments: analyses?.length || 0,
        averageScore: 85,
        improvementRate: 24,
      });
    };

    if (session?.user?.id) {
      fetchAnalysisStats();
    }
  }, [session?.user?.id]);

  if (!session) return null;

  const userName = userProfile?.full_name || userProfile?.username || session?.user?.email?.split('@')[0] || 'User';
  
  // Check if user has unlimited access (either by email or document limit)
  const hasUnlimitedAccess = userProfile?.email === 'enjoywithpandu@gmail.com' || userProfile?.document_limit >= 999999;

  return (
    <div className="container mx-auto px-4 py-8">
      <LimitNotification userProfile={userProfile} />
      
      {showUpgradeBanner && !hasUnlimitedAccess && (
        <div className="mb-8">
          <UpgradeBanner
            buttonText="Upgrade Now"
            description="for unlimited document analysis"
            onClose={() => setShowUpgradeBanner(false)}
            onClick={() => navigate("/pricing")}
          />
        </div>
      )}

      {hasUnlimitedAccess && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-900 mb-1">🚀 Unlimited Access Active</h3>
              <p className="text-purple-700">
                {userProfile?.email === 'enjoywithpandu@gmail.com' 
                  ? 'Admin account with unlimited document analysis capabilities' 
                  : 'You have unlimited document analysis capabilities'}
              </p>
            </div>
          </div>
        </div>
      )}

      <DonationDialog 
        open={showDonationDialog} 
        onOpenChange={setShowDonationDialog} 
      />

      <DashboardHeader 
        userName={userName} 
        onTabChange={setActiveTab} 
      />

      <StatsCards stats={analysisStats} />

      <ActivitySummary />

      <ContentTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userId={session.user.id} 
      />
    </div>
  );
};
