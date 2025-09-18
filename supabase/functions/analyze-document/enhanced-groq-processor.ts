import { extractAndValidateText } from "./text-processing.ts";
import { smartChunking } from "./text-chunking.ts";
import { callGroqCloudAPI, analyzeWithVision, getBestModel } from "./groqcloud-client.ts";
import { getDocumentContext } from "./gemini-client.ts";
import { getDetailedPrompt, getLegalPrompt, getBusinessPrompt } from "./prompt-templates.ts";

/**
 * Ultra-fast processor using GroqCloud's lightning-fast models
 */
export async function processWithGroqCloud(text: string, fileName: string, fileBuffer?: ArrayBuffer): Promise<string> {
  console.log(`🚀 FAST GroqCloud analysis for: ${fileName}`);
  
  try {
    // Super fast text extraction
    const cleanedText = extractAndValidateText(text, fileName);
    console.log(`⚡ Text processed: ${cleanedText.length} characters`);
    
    // Quick document context analysis
    const documentContext = getDocumentContext(cleanedText, fileName);
    console.log(`📊 Document type: ${documentContext.type}`);
    
    // Check file type for optimal processing
    const fileExtension = fileName.toLowerCase().split('.').pop() || '';
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    
    // Use vision for images and PDFs with images
    if ((isImage || isPDF) && fileBuffer) {
      try {
        console.log(`🖼️ Using vision analysis for ${fileExtension}`);
        let base64Data: string;
        
        if (isImage) {
          const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
          base64Data = `data:${mimeType};base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
        } else {
          base64Data = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
        }
        
        const visionResult = await analyzeWithVision(base64Data, cleanedText);
        return formatProfessionalSummary(visionResult, fileName, documentContext.type, "Lightning Vision Analysis");
      } catch (visionError) {
        console.log("⚠️ Vision failed, using text analysis:", visionError);
      }
    }
    
    // Ultra-fast text processing with best model
    const model = "llama-3.3-70b-versatile"; // Fastest high-quality model
    
    // Smart chunking for optimal speed
    const chunks = smartChunking(cleanedText, 4000); // Smaller chunks for speed
    console.log(`📑 Split into ${chunks.length} chunks for speed`);
    
    let finalSummary: string;
    
    if (chunks.length === 1) {
      // Single chunk - lightning fast
      finalSummary = await processSingleChunkGroq(chunks[0], documentContext, fileName, model);
    } else {
      // Multi-chunk with parallel processing for speed
      finalSummary = await processMultipleChunksGroq(chunks, documentContext, fileName, model);
    }
    
    return formatProfessionalSummary(finalSummary, fileName, documentContext.type, "GroqCloud Lightning Analysis");
    
  } catch (error) {
    console.error("💥 GroqCloud processing error:", error);
    throw error;
  }
}

async function processSingleChunkGroq(
  chunk: string, 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  // Professional-grade prompts for valuable analysis
  let prompt = getDetailedPrompt("complete");
  
  if (context.type === 'legal') {
    prompt = getLegalPrompt();
  } else if (context.type === 'business') {
    prompt = getBusinessPrompt();
  }
  
  return await callGroqCloudAPI(chunk, prompt, model);
}

async function processMultipleChunksGroq(
  chunks: string[], 
  context: { type: string, approach: string }, 
  fileName: string, 
  model: string
): Promise<string> {
  
  console.log(`⚡ Processing ${chunks.length} chunks in parallel for maximum speed`);
  
  try {
    // Process chunks in parallel with detailed analysis
    const chunkPromises = chunks.map(async (chunk, i) => {
      let prompt = getDetailedPrompt("chunk", i + 1, chunks.length);
      
      if (context.type === 'legal') {
        prompt = `You are analyzing section ${i + 1} of ${chunks.length} from a legal document. ${getLegalPrompt()}`;
      } else if (context.type === 'business') {
        prompt = `You are analyzing section ${i + 1} of ${chunks.length} from a business document. ${getBusinessPrompt()}`;
      }
      
      const result = await callGroqCloudAPI(chunk, prompt, model);
      return `**SECTION ${i + 1} ANALYSIS:**\n${result}`;
    });
    
    const chunkSummaries = await Promise.all(chunkPromises);
    
    // Comprehensive synthesis
    const combinedText = chunkSummaries.join("\n\n═══════════════════════════════════════\n\n");
    const combinePrompt = getDetailedPrompt("combine");
    
    return await callGroqCloudAPI(combinedText, combinePrompt, model);
    
  } catch (error) {
    console.log("⚠️ Parallel processing failed, using sequential:");
    // Fallback to sequential processing
    const chunkSummaries = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`📄 Processing chunk ${i + 1}/${chunks.length}`);
      const prompt = `Analyze section ${i + 1}/${chunks.length}:`;
      const chunkSummary = await callGroqCloudAPI(chunks[i], prompt, model);
      chunkSummaries.push(`SECTION ${i + 1}: ${chunkSummary}`);
    }
    
    const combinedText = chunkSummaries.join("\n\n---\n\n");
    return await callGroqCloudAPI(combinedText, "Combine these sections into comprehensive analysis:", model);
  }
}

function formatProfessionalSummary(summary: string, fileName: string, documentType: string, analysisType: string): string {
  // Clean and preserve structure for professional presentation
  const cleanSummary = summary
    .replace(/#{1,6}\s*/g, '')
    .replace(/DOCUMENT ANALYSIS REPORT.*?\n/g, '')
    .replace(/File:.*?\n/g, '')
    .replace(/Analysis Date:.*?\n/g, '')
    .replace(/Document Type:.*?\n/g, '')
    .replace(/Analysis Method:.*?\n/g, '')
    .trim();
  
  // Create professional document header
  const analysisDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const header = `📋 **PROFESSIONAL DOCUMENT ANALYSIS REPORT**

**Document:** ${fileName}
**Analysis Date:** ${analysisDate}
**Document Type:** ${documentType.charAt(0).toUpperCase() + documentType.slice(1)}
**Analysis Method:** ${analysisType}

═══════════════════════════════════════════════════════════════════

`;
  
  const footer = `

═══════════════════════════════════════════════════════════════════
**Analysis Complete** | Professional Document Review | ${analysisDate}`;
  
  return header + cleanSummary + footer;
}
