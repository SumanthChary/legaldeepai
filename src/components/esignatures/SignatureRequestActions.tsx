
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SignatureRequestActionsProps = {
  request: {
    id: string;
    document_name: string;
    document_path: string;
    completed_document_path?: string | null;
    status: string;
  };
  onRefresh: () => void;
};

export function SignatureRequestActions({ request, onRefresh }: SignatureRequestActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("signature_requests")
        .delete()
        .eq("id", request.id);

      if (error) throw error;

      toast({ title: "Request deleted successfully" });
      onRefresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete request";
      toast({
        title: "Error deleting request",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const path = request.status === "completed" && request.completed_document_path
        ? request.completed_document_path
        : request.document_path;

      const { data, error } = await supabase.storage
        .from("esignatures")
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = request.status === "completed"
        ? `${request.document_name.replace(/\.pdf$/i, "")}-signed.pdf`
        : request.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: request.status === "completed" ? "Signed document downloaded" : "Document downloaded" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to download document";
      toast({
        title: "Error downloading document",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="flex items-center gap-1"
      >
        <Download className="w-3 h-3" />
        Download
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="flex items-center gap-1 text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </Button>
    </div>
  );
}
