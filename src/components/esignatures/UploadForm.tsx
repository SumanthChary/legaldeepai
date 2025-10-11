
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Pen, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FancyFileInput } from "./FancyFileInput";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  user: User | null;
  fetchRequests: () => void;
};

export function UploadForm({ user, fetchRequests }: Props) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [signerEmail, setSignerEmail] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !signerEmail) {
      toast({ title: "Please select a file and enter a signer email.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please sign in to create signature requests.", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      // Upload PDF to Supabase Storage (bucket: 'esignatures')
      const filename = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("esignatures")
        .upload(filename, file);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }
      
      const document_path = uploadData?.path || filename;

      // Insert signature_request
      const { data: requestData, error: requestError } = await supabase
        .from("signature_requests")
        .insert({
          user_id: user.id,
          document_name: file.name,
          document_path,
          status: "pending"
        })
        .select()
        .single();

      if (requestError) {
        throw new Error(`Failed to create request: ${requestError.message}`);
      }

      // Insert a single signature_field for now
      const { error: fieldError } = await supabase
        .from("signature_fields")
        .insert({
          request_id: requestData.id,
          assigned_signer_email: signerEmail.toLowerCase(),
          field_type: "signature",
          position: { page: 1, x: 100, y: 200, width: 200, height: 60 },
          required: true,
  });

      if (fieldError) {
        throw new Error(`Failed to add signer: ${fieldError.message}`);
      }

      // Trigger edge function to create signing session and dispatch invite
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        "create-signing-session",
        {
          body: {
            requestId: requestData.id,
            signerEmail,
          },
        }
      );

      if (sessionError) {
        console.error("Session creation error", sessionError);
        throw new Error(sessionError.message || "Failed to initialize signing session");
      }

      toast({ 
        title: "Success!", 
        description: `Signature request created successfully and invite emailed to ${signerEmail}` 
      });
      
      // Reset form
      setFile(null);
      setSignerEmail("");
      fetchRequests();
      
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to create signature request";
      toast({ 
        title: "Error", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="flex-1 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 xl:p-10 bg-white/75 backdrop-blur-md border border-purple-100">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="text-purple-700 w-6 h-6" />
        <h2 className="font-bold text-base sm:text-lg md:text-xl xl:text-2xl text-purple-900 tracking-tight">
          New E-Signature Request
        </h2>
      </div>
      <form onSubmit={handleUpload} className="space-y-6">
        <FancyFileInput file={file} setFile={setFile} uploading={uploading} />
        <div>
          <label className="text-sm font-medium text-purple-800 block mb-1">Signer Email</label>
          <Input
            type="email"
            placeholder="name@example.com"
            required
            value={signerEmail}
            onChange={e => setSignerEmail(e.target.value)}
            disabled={uploading}
            className="bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 transition-colors duration-200 h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={uploading || !file || !signerEmail}
          className="w-full bg-gradient-to-tr from-purple-600 to-blue-400 hover:from-purple-700 hover:to-blue-500 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Creating...
            </span>
          ) : (
            <>
              <Pen className="mr-2 w-4 h-4" /> Create Signature Request
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
