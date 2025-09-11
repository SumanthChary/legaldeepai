
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { 
  DocumentHeader, 
  DocumentInfo, 
  StatusDisplay, 
  SummaryContent,
  DocumentNotFound,
  DocumentLoading,
  SummaryActions
} from "@/components/document-summary";
import { GoogleIntegrationPanel } from "@/components/google/GoogleIntegrationPanel";
import { useDocumentAnalysis } from "@/hooks/document-summary/useDocumentAnalysis";

const DocumentSummary = () => {
  const { id } = useParams();
  const { analysis, loading, refreshing, fetchAnalysis } = useDocumentAnalysis(id || '');

  if (loading) {
    return <DocumentLoading />;
  }

  if (!analysis) {
    return <DocumentNotFound />;
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <SummaryContent 
              analysisStatus={analysis.analysis_status} 
              summary={analysis.summary}
              originalName={analysis.original_name}
              analysisId={id || ''}
              refreshAnalysis={fetchAnalysis}
              refreshing={refreshing}
            />
            
            {/* Google Integration Panel */}
            {analysis.analysis_status === 'completed' && (
              <GoogleIntegrationPanel
                documentTitle={analysis.original_name || 'Document Analysis'}
                documentContent={analysis.summary || ''}
                analysisId={id}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentSummary;
