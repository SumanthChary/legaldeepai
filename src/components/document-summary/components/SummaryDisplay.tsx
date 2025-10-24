
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef } from "react";
import { TextSelectionAI } from "../TextSelectionAI";

interface SummaryDisplayProps {
  summary: string;
  isEmergencyProcessing: boolean;
}

export const SummaryDisplay = ({ summary, isEmergencyProcessing }: SummaryDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [showAI, setShowAI] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const formattedSummary = formatSummary(summary);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedContent = selection.toString().trim();
      if (selectedContent.length > 10) { // Only show for meaningful selections
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(selectedContent);
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
        setShowAI(true);
      }
    } else {
      setShowAI(false);
    }
  };

  return (
    <>
      <div className={`relative ${isExpanded ? '' : 'max-h-80 overflow-hidden'}`}>
        <div 
          ref={contentRef}
          className="p-6 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-line text-base font-editorial-new leading-relaxed select-text"
          onMouseUp={handleTextSelection}
          style={{ userSelect: 'text' }}
        >
          {formattedSummary}
          
          {!isExpanded && summary.length > 500 && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent rounded-b-lg"></div>
          )}
        </div>
      </div>
      
      {summary.length > 500 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center border-gray-900 font-editorial-new"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show Full Analysis
            </>
          )}
        </Button>
      )}

      {showAI && selectedText && (
        <TextSelectionAI
          selectedText={selectedText}
          position={selectionPosition}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
};

function formatSummary(text: string): string {
  const cleaned = text
    .replace(/^\s*---\s*$/gm, '')
    .replace(/^#+\s*/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove duplicate phrases and repeated words
    .replace(/(\b\w+\b)(\s+\1\b)+/gi, '$1')
    // Remove repeated titles/headers
    .replace(/(^.+$)\n+\1$/gm, '$1')
    // Clean up repeated line patterns
    .replace(/(.+)\n\1+/g, '$1')
    .trim();

  const hasStructure = /^\d+\.\s|\n\s*[-•*]\s|\n\s*\d+\.\s/m.test(cleaned);
  
  if (hasStructure) {
    return cleaned
      .replace(/\n{3,}/g, '\n\n')
      .replace(/(\n\s*[-•*]\s.*?)(\n[^-•*\s])/g, '$1\n$2')
      .replace(/(\n\s*\d+\.\s.*?)(\n[^\d\s])/g, '$1\n$2');
  }
  
  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n');
}
