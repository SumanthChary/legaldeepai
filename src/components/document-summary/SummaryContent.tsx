import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, RefreshCw, Download, Copy, BarChart3, Sparkles } from "lucide-react";
import { SummaryDisplay } from "./components/SummaryDisplay";
import { StructuredAnalysis } from "./components/StructuredAnalysis";
import { DocumentMetricsCharts } from "./components/DocumentMetricsCharts";
import { useDocumentMetrics } from "./hooks/useDocumentMetrics";
import { toast } from "@/hooks/use-toast";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { useFeedbackTrigger } from "@/hooks/useFeedbackTrigger";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
  originalName?: string;
  analysisId?: string;
  refreshAnalysis?: () => void;
  refreshing?: boolean;
}

export const SummaryContent = ({ analysisStatus, summary, originalName, analysisId, refreshAnalysis, refreshing }: SummaryContentProps) => {
  const isCompleted = analysisStatus === 'completed';
  const { showFeedback, closeFeedback } = useFeedbackTrigger(analysisId || '', isCompleted);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Generate document metrics when summary is available
  const metrics = useDocumentMetrics(summary || '', originalName || '');

  if (analysisStatus !== 'completed') {
    return null;
  }

  if (!summary || summary.trim().length === 0 || summary === 'null' || summary === 'undefined') {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Analysis Processing Issue</h3>
              <p className="text-yellow-700">The document was processed but the summary is not available. Please try re-uploading the document.</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const isEmergencyProcessing = summary.includes("EMERGENCY") || 
                               summary.includes("Emergency Processing") ||
                               summary.includes("emergency analysis mode") ||
                               summary.includes("Processing challenges");

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast({ title: "Copied to clipboard", description: "Summary has been copied to your clipboard." });
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalName}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Combined Header Section */}
      <div className="bg-white border border-gray-900 rounded-lg">
        {/* File Info Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <h1 className="text-lg font-editorial-new font-light text-gray-900">{originalName}</h1>
                <p className="text-sm text-gray-500 font-editorial-new">AI Legal Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAnalysis}
                disabled={refreshing}
                className="border-gray-900 font-editorial-new"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-gray-900 font-editorial-new"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-gray-900 font-editorial-new"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetrics(!showMetrics)}
                className={`border-gray-900 font-editorial-new ${showMetrics ? 'bg-gray-100' : ''}`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Processing Warning */}
        {isEmergencyProcessing && (
          <div className="border-b border-gray-200 px-6 py-4 bg-yellow-50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-editorial-new font-light text-yellow-800 mb-1">Emergency Processing Mode</p>
                <p className="text-yellow-700 font-editorial-new">
                  Document processed in emergency mode. For enhanced analysis, try re-uploading.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Content */}
        <div className="p-6">
          <Tabs defaultValue="structured" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="structured" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="full">Full Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structured">
              <StructuredAnalysis summary={summary} />
            </TabsContent>
            
            <TabsContent value="full">
              <SummaryDisplay 
                summary={summary}
                isEmergencyProcessing={isEmergencyProcessing}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Document Analytics Section */}
      {showMetrics && (
        <div className="bg-white border border-gray-900 rounded-lg p-6">
          <DocumentMetricsCharts 
            metrics={metrics}
            fileName={originalName || 'document'}
          />
        </div>
      )}

      <FeedbackModal
        open={showFeedback}
        onClose={closeFeedback}
        analysisId={analysisId || ''}
      />
    </div>
  );
};
