import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LimitCheckDialog } from "../LimitCheckDialog";

interface LimitAwareUploadButtonProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
}

export const LimitAwareUploadButton = ({ onFileSelect, disabled }: LimitAwareUploadButtonProps) => {
  const [showLimitCheck, setShowLimitCheck] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check user limits first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, document_count, document_limit')
      .eq('id', user.id)
      .single();

    // Skip limit check for admin user
    if (profile?.email === 'enjoywithpandu@gmail.com') {
      onFileSelect(files);
      return;
    }

    // Check if user is at limit
    if (profile && profile.document_count >= profile.document_limit) {
      setPendingFiles(files);
      setShowLimitCheck(true);
      return;
    }

    // Proceed with upload
    onFileSelect(files);
  };

  const handleLimitCheckProceed = () => {
    setShowLimitCheck(false);
    onFileSelect(pendingFiles);
    setPendingFiles([]);
  };

  const handleLimitCheckClose = () => {
    setShowLimitCheck(false);
    setPendingFiles([]);
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        disabled={disabled}
        className="relative overflow-hidden"
        asChild
      >
        <label className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Choose Files
          <input
            type="file"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            disabled={disabled}
          />
        </label>
      </Button>

      <LimitCheckDialog
        isOpen={showLimitCheck}
        onClose={handleLimitCheckClose}
        onProceed={handleLimitCheckProceed}
      />
    </>
  );
};