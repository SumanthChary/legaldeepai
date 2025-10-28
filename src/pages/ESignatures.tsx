
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ESignaturesHeroSection } from "./ESignaturesHeroSection";
import { UploadForm } from "@/components/esignatures/UploadForm";
import { SignatureRequestsList } from "@/components/esignatures/SignatureRequestsList";
import type { User } from "@supabase/supabase-js";

// ESignature types
type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  completed_document_path?: string | null;
  document_hash?: string | null;
  status: string;
  created_at: string;
};

export default function ESignatures() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("signature_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRequests(data);
      } else if (error) {
        console.error("Error fetching requests:", error);
        toast({
          title: "Error fetching requests",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch current user's requests
  useEffect(() => {
    import("@/integrations/supabase/client").then(({ supabase }) =>
      supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    );
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="max-w-4xl mx-auto pb-10 px-2 md:px-6 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center gap-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-purple-100 bg-white/70 hover:bg-purple-50 hover:shadow-lg shadow-md md:ml-1 transition-all gap-1"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5 text-purple-700" />
          <span className="font-medium text-purple-900">Back</span>
        </Button>
      </div>

      {/* Hero Section */}
      <ESignaturesHeroSection />

      {/* Upload Form & Image */}
      <section className="flex flex-col-reverse lg:flex-row gap-8 mb-12 items-stretch animate-fade-in">
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            src="/lovable-uploads/87ef7b87-6da4-45d5-922b-7851221679c0.png"
            alt="Smiling person using e-signature"
            className="rounded-2xl shadow-lg max-w-xs md:max-w-sm ring-2 ring-purple-200 object-cover w-full transition-transform duration-300 hover:scale-105"
            style={{ aspectRatio: "4/3" }}
            loading="lazy"
            decoding="async"
            width={720}
            height={960}
          />
        </div>
        <UploadForm user={user} fetchRequests={fetchRequests} />
      </section>

      {/* Requests List */}
      <SignatureRequestsList requests={requests} loading={loading} onRefresh={fetchRequests} />
    </div>
  );
}
