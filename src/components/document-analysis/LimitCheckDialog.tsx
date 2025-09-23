import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface LimitCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const LimitCheckDialog = ({ isOpen, onClose, onProceed }: LimitCheckDialogProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setUserProfile(profile);
  };

  if (!userProfile) return null;

  // Don't show for unlimited access users
  if (userProfile.email === 'enjoywithpandu@gmail.com') {
    onProceed();
    return null;
  }

  const remainingDocs = userProfile.document_limit - userProfile.document_count;
  const isAtLimit = remainingDocs <= 0;

  if (isAtLimit) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Document Limit Reached</span>
            </DialogTitle>
            <DialogDescription>
              You've reached your document analysis limit of {userProfile.document_limit} documents. 
              Upgrade your plan to continue analyzing documents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/pricing")}>
              Upgrade Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // If not at limit, proceed
  onProceed();
  return null;
};