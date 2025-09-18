
import { extractAndValidateText } from "./text-processing.ts";
import { smartChunking } from "./text-chunking.ts";
import { callGeminiAPI, getDocumentContext } from "./gemini-client.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";
import { DocumentAnalysisError, handleApiError, handleProcessingError, generateSuccessfulSummary } from "./enhanced-error-handling.ts";

/**
 * Bulletproof document processor that never fails
 */
export async function processBulletproof(text: string, fileName: string): Promise<string> {
  console.log(`🚀 Starting bulletproof analysis for: ${fileName}`);
  
  try {
    // Step 1: Text extraction and validation with enhanced error handling
    let cleanedText: string;
    try {
      cleanedText = extractAndValidateText(text, fileName);
      console.log(`✅ Text extracted successfully: ${cleanedText.length} characters`);
    } catch (error) {
      console.error("❌ Text extraction failed:", error);
      throw handleProcessingError(error, fileName);
    }
    
    // Step 2: Document context analysis
    const documentContext = getDocumentContext(cleanedText, fileName);
    console.log(`📊 Document context: ${documentContext.type} - ${documentContext.approach}`);
    
    // Step 3: Smart chunking
    const chunks = smartChunking(cleanedText);
    console.log(`📑 Document split into ${chunks.length} chunks`);
    
    // Step 4: AI Analysis with multiple fallback strategies
    let finalSummary: string;
    
    if (chunks.length === 1) {
      // Single chunk analysis
      finalSummary = await processSingleChunk(chunks[0], documentContext, fileName);
    } else {
      // Multi-chunk analysis
      finalSummary = await processMultipleChunks(chunks, documentContext, fileName);
    }
    
    // Step 5: Final validation and formatting
    if (!finalSummary || finalSummary.trim().length < 100) {
      throw new Error("Generated summary is too short");
    }
    
    const result = generateSuccessfulSummary(finalSummary, fileName, documentContext.type);
    console.log(`🎉 Analysis completed successfully for ${fileName}`);
    return result;
    
  } catch (error) {
    console.error("💥 Bulletproof processor caught error:", error);
    
    if (error instanceof DocumentAnalysisError) {
      throw error;
    }
    
    // Last resort fallback
    return generateEmergencyFallback(text, fileName, error);
  }
}

async function processSingleChunk(
  chunk: string, 
  context: { type: string, approach: string }, 
  fileName: string
): Promise<string> {
  const strategies = [
    {
      name: "Specialized Professional Analysis",
      getPrompt: () => {
        if (context.type === 'legal') return getLegalPrompt();
        if (context.type === 'business') return getBusinessPrompt();
        return getDetailedPrompt("complete");
      },
      temperature: 0.1
    },
    {
      name: "Comprehensive Standard Analysis",
      getPrompt: () => getDetailedPrompt("complete"),
      temperature: 0.2
    },
    {
      name: "Focused Professional Review",
      getPrompt: () => "You are a senior document analyst. Provide a comprehensive, professional analysis with detailed breakdown of key provisions, risk assessment, financial implications, and actionable recommendations. Focus on practical insights that deliver real value:",
      temperature: 0.1
    }
  ];
  
  for (const strategy of strategies) {
    try {
      console.log(`🔄 Trying ${strategy.name} strategy`);
      const result = await callGeminiAPI(chunk, strategy.getPrompt(), strategy.temperature);
      
      if (result && result.length > 100) {
        console.log(`✅ ${strategy.name} strategy succeeded`);
        return result;
      }
    } catch (error) {
      console.log(`❌ ${strategy.name} strategy failed:`, error.message);
      continue;
    }
  }
  
  throw handleApiError(new Error("All analysis strategies failed"));
}

async function processMultipleChunks(
  chunks: string[], 
  context: { type: string, approach: string }, 
  fileName: string
): Promise<string> {
  try {
    // Process chunks with progressive fallback
    const chunkSummaries = [];
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`📄 Processing chunk ${i + 1}/${chunks.length}`);
      
      try {
        const chunkSummary = await callGeminiAPI(
          chunks[i],
          getDetailedPrompt("chunk", i + 1, chunks.length),
          0.2
        );
        chunkSummaries.push(`**Section ${i + 1}:**\n${chunkSummary}`);
      } catch (error) {
        console.log(`⚠️ Chunk ${i + 1} failed, using simplified approach`);
        const simplifiedSummary = await callGeminiAPI(
          chunks[i].substring(0, 5000),
          "Summarize this document section clearly and comprehensively:",
          0.1
        );
        chunkSummaries.push(`**Section ${i + 1}:**\n${simplifiedSummary}`);
      }
    }
    
    // Combine summaries
    const combinedText = chunkSummaries.join("\n\n---\n\n");
    return await callGeminiAPI(
      combinedText,
      getDetailedPrompt("combine"),
      0.1
    );
    
  } catch (error) {
    console.log("❌ Multi-chunk processing failed, falling back to first chunk");
    return await processSingleChunk(chunks[0], context, fileName);
  }
}

function generateEmergencyFallback(text: string, fileName: string, error: any): string {
  const preview = text.substring(0, 1000).replace(/\s+/g, ' ').trim();
  const timestamp = new Date().toLocaleDateString();
  
  return `📄 **Document Analysis Report**
**Document:** ${fileName}
**Status:** Partial Analysis
**Date:** ${timestamp}

⚠️ **Processing Notice:** Our AI analysis encountered technical difficulties, but we've extracted the document content for your review.

📝 **Document Preview:**
${preview}${text.length > 1000 ? '...' : ''}

🔧 **What happened:** ${error.message || 'Technical processing issue'}

💡 **Recommended Actions:**
• Try uploading the document again
• Ensure the file contains readable text (not scanned images)
• For large documents, try breaking them into smaller sections
• Contact support if the issue persists

---

✅ **Document Received** | LegalDeep AI Emergency Processing | ${timestamp}`;
}
