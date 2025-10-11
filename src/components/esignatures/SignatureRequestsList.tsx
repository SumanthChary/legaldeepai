
import { FileText, Check, Pen, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SignatureRequestActions } from "./SignatureRequestActions";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  completed_document_path?: string | null;
  document_hash?: string | null;
  status: string;
  created_at: string;
};

type SignatureRequestsListProps = {
  requests: SignatureRequest[];
  loading: boolean;
  onRefresh: () => void;
};

export function SignatureRequestsList({ requests, loading, onRefresh }: SignatureRequestsListProps) {
  if (loading) {
    return (
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6 pl-1">
          <FileText className="text-blue-500 w-5 h-5" />
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-purple-800">
            My Signature Requests
          </h3>
        </div>
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 rounded-xl shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="flex justify-between items-end mb-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="w-5 h-5" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 pl-1">
        <FileText className="text-blue-500 w-5 h-5" />
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-purple-800">
          My Signature Requests
        </h3>
      </div>
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map(r => (
          <div
            key={r.id}
            className={"bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-4 sm:p-5 rounded-xl flex flex-col gap-3 shadow hover:shadow-lg transition-all duration-200 shadow-purple-100/30 " +
              (r.status === "completed" ? "ring-2 ring-green-200" : "")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-purple-700 w-4 h-4" />
              <span className="font-semibold text-purple-900 truncate">{r.document_name}</span>
            </div>
            <div className="flex flex-row gap-4 items-end justify-between">
              <span className={`text-xs rounded-full px-3 py-1 font-bold capitalize transition-colors duration-200
                ${r.status === "pending" ? "bg-purple-100 text-purple-800"
                  : r.status === "completed" ? "bg-green-100 text-green-800"
                  : r.status === "in_progress" ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"}`}>
                {r.status.replace('_', ' ')}
              </span>
              {r.status === "completed" ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : r.status === "in_progress" ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Pen className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Created: {new Date(r.created_at).toLocaleString()}
            </div>
            {r.status === "completed" && (
              <div className="text-[11px] text-gray-500 break-all bg-gray-50 border border-gray-100 rounded-md px-2 py-1">
                Hash: {r.document_hash || "pending"}
              </div>
            )}
            <SignatureRequestActions request={r} onRefresh={onRefresh} />
          </div>
        ))}
        {requests.length === 0 && (
          <div className="col-span-full text-purple-400 text-center py-14 font-semibold text-lg rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow">
            No requests yet.<br />
            <span className="text-base font-normal block mt-2 text-purple-300">Create your first e-signature request above!</span>
          </div>
        )}
      </div>
    </section>
  );
}
