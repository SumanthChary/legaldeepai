import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, FileText, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StructuredAnalysisProps {
  summary: string;
}

export const StructuredAnalysis = ({ summary }: StructuredAnalysisProps) => {
  // Parse the structured summary into sections
  const sections = parseStructuredSummary(summary);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {sections.executiveSummary && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed">{sections.executiveSummary}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Document Classification */}
      {sections.classification && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Document Classification
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sections.classification.type && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <Badge variant="outline" className="text-sm">{sections.classification.type}</Badge>
              </div>
            )}
            {sections.classification.riskLevel && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <Badge variant={getRiskVariant(sections.classification.riskLevel)}>
                  {sections.classification.riskLevel}
                </Badge>
              </div>
            )}
            {sections.classification.purpose && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Purpose</p>
                <p className="text-sm font-medium text-gray-900">{sections.classification.purpose}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Key Provisions & Clauses */}
      {sections.clauses && sections.clauses.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Key Provisions & Clauses Analysis
          </h3>
          <div className="space-y-4">
            {sections.clauses.map((clause, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{clause.name}</h4>
                  {clause.risk && (
                    <Badge variant={getRiskVariant(clause.risk)} className="ml-2">
                      {clause.risk} RISK
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{clause.explanation}</p>
                {clause.impact && (
                  <div className="flex items-start space-x-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-gray-600 italic">Impact: {clause.impact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Financial Obligations */}
      {sections.financial && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Financial Obligations & Terms
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{sections.financial}</p>
          </div>
        </Card>
      )}

      {/* Critical Risks & Red Flags */}
      {sections.risks && sections.risks.length > 0 && (
        <Card className="p-6 bg-red-50 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Critical Risks & Red Flags
          </h3>
          <div className="space-y-3">
            {sections.risks.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{risk}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Compliance & Legal Requirements */}
      {sections.compliance && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Compliance & Legal Requirements
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{sections.compliance}</p>
          </div>
        </Card>
      )}

      {/* Strategic Recommendations */}
      {sections.recommendations && sections.recommendations.length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" />
            Strategic Recommendations
          </h3>
          <div className="space-y-2">
            {sections.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline & Deadlines */}
      {sections.timeline && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-600" />
            Timeline & Critical Deadlines
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{sections.timeline}</p>
          </div>
        </Card>
      )}

      {/* Fallback for unstructured content */}
      {!hasStructuredContent(sections) && (
        <Card className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{summary}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

type StructuredSummarySections = {
  executiveSummary: string | null;
  classification: {
    type?: string;
    purpose?: string;
    riskLevel?: string;
  };
  clauses: Array<{
    name: string;
    explanation: string;
    risk: string | null;
    impact: string | null;
  }>;
  financial: string | null;
  risks: string[];
  compliance: string | null;
  recommendations: string[];
  timeline: string | null;
};

function parseStructuredSummary(summary: string) {
  const sections: StructuredSummarySections = {
    executiveSummary: null,
    classification: {},
    clauses: [],
    financial: null,
    risks: [],
    compliance: null,
    recommendations: [],
    timeline: null
  };

  // Extract Executive Summary
  const execMatch = summary.match(/=== EXECUTIVE SUMMARY ===([\s\S]*?)(?:===|$)/i);
  if (execMatch) sections.executiveSummary = execMatch[1].trim();

  // Extract Document Classification
  const classMatch = summary.match(/=== DOCUMENT CLASSIFICATION ===([\s\S]*?)(?:===|$)/i);
  if (classMatch) {
    const classText = classMatch[1];
    const typeMatch = classText.match(/Type:\s*(.+)/i);
    const purposeMatch = classText.match(/Purpose:\s*(.+)/i);
    const riskMatch = classText.match(/Risk Level:\s*(HIGH|MEDIUM|LOW)/i);
    
    if (typeMatch) sections.classification.type = typeMatch[1].trim();
    if (purposeMatch) sections.classification.purpose = purposeMatch[1].trim();
    if (riskMatch) sections.classification.riskLevel = riskMatch[1].trim();
  }

  // Extract Key Provisions & Clauses
  const clausesMatch = summary.match(/=== KEY PROVISIONS & CLAUSES ===([\s\S]*?)(?:===|$)/i);
  if (clausesMatch) {
    const clausesText = clausesMatch[1];
    const clausePattern = /•\s*([^:]+):\s*([^\n]+)(?:\n\s*Risk:\s*(HIGH|MEDIUM|LOW))?(?:\n\s*Impact:\s*([^\n]+))?/gi;
    let match;
    while ((match = clausePattern.exec(clausesText)) !== null) {
      sections.clauses.push({
        name: match[1].trim(),
        explanation: match[2].trim(),
        risk: match[3]?.trim() || null,
        impact: match[4]?.trim() || null
      });
    }
  }

  // Extract Financial Obligations
  const financialMatch = summary.match(/=== FINANCIAL OBLIGATIONS ===([\s\S]*?)(?:===|$)/i);
  if (financialMatch) sections.financial = financialMatch[1].trim();

  // Extract Critical Risks
  const risksMatch = summary.match(/=== CRITICAL RISKS & RED FLAGS ===([\s\S]*?)(?:===|$)/i);
  if (risksMatch) {
    const risksText = risksMatch[1];
    const riskLines = risksText.split(/\n/).filter(line => line.trim().startsWith('🚨') || line.trim().startsWith('•'));
  sections.risks = riskLines.map(line => line.replace(/^[🚨•]\s*/u, '').trim()).filter(Boolean);
  }

  // Extract Compliance
  const complianceMatch = summary.match(/=== COMPLIANCE & LEGAL REQUIREMENTS ===([\s\S]*?)(?:===|$)/i);
  if (complianceMatch) sections.compliance = complianceMatch[1].trim();

  // Extract Recommendations
  const recsMatch = summary.match(/=== STRATEGIC RECOMMENDATIONS ===([\s\S]*?)(?:===|$)/i);
  if (recsMatch) {
    const recsText = recsMatch[1];
    const recLines = recsText.split(/\n/).filter(line => line.trim().startsWith('✓') || line.trim().startsWith('•'));
  sections.recommendations = recLines.map(line => line.replace(/^[✓•]\s*/u, '').trim()).filter(Boolean);
  }

  // Extract Timeline
  const timelineMatch = summary.match(/=== TIMELINE & DEADLINES ===([\s\S]*?)(?:===|$)/i);
  if (timelineMatch) sections.timeline = timelineMatch[1].trim();

  return sections;
}

function hasStructuredContent(sections: StructuredSummarySections): boolean {
  return !!(
    sections.executiveSummary ||
    sections.classification.type ||
    sections.clauses.length > 0 ||
    sections.financial ||
    sections.risks.length > 0 ||
    sections.compliance ||
    sections.recommendations.length > 0 ||
    sections.timeline
  );
}

function getRiskVariant(riskLevel: string): "default" | "destructive" | "secondary" {
  const level = riskLevel.toUpperCase();
  if (level.includes('HIGH')) return 'destructive';
  if (level.includes('MEDIUM')) return 'secondary';
  return 'default';
}
