import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface LimitNotificationProps {
  userProfile: any;
}

export const LimitNotification = ({ userProfile }: LimitNotificationProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile || dismissed) return;

    // Don't show for unlimited access users
    if (userProfile.email === 'enjoywithpandu@gmail.com') return;

    const usagePercentage = (userProfile.document_count / userProfile.document_limit) * 100;
    
    // Show notification when user reaches 80% of their limit
    if (usagePercentage >= 80) {
      setShowNotification(true);
    }
  }, [userProfile, dismissed]);

  if (!showNotification || dismissed) return null;

  const remainingDocs = userProfile.document_limit - userProfile.document_count;
  const isAtLimit = remainingDocs <= 0;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          {isAtLimit ? (
            <span className="text-orange-800 font-medium">
              You've reached your document limit! Upgrade to continue analyzing documents.
            </span>
          ) : (
            <span className="text-orange-800">
              You have only <strong>{remainingDocs}</strong> document analysis{remainingDocs !== 1 ? 'es' : ''} remaining.
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            onClick={() => navigate("/pricing")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Upgrade Plan
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};