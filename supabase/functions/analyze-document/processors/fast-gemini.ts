
import { callGeminiAPI } from "../gemini-client.ts";

export async function processWithGeminiUltraFast(text: string, fileName: string): Promise<string> {
  console.log("📝 Gemini LIGHTNING-SPEED text processing - API CALL STARTING");
  console.log(`🔑 Gemini API Key available: ${!!Deno.env.get('GEMINI_API_KEY')}`);
  
  const prompt = `You are an elite legal AI analyst. Provide a STRUCTURED, PROFESSIONAL analysis in these EXACT sections:

=== EXECUTIVE SUMMARY ===
[2-3 sentence overview of document type, purpose, and critical findings]

=== DOCUMENT CLASSIFICATION ===
Type: [Contract/Agreement/Legal Document/Business Document]
Purpose: [Primary business/legal purpose]
Parties: [Key stakeholders if applicable]
Risk Level: [HIGH/MEDIUM/LOW with one-line reasoning]

=== KEY PROVISIONS & CLAUSES ===
[List 3-5 most important clauses/sections with format:]
• Clause Name: [Brief explanation]
  Risk: [HIGH/MEDIUM/LOW]
  Impact: [Business/financial impact]

=== FINANCIAL OBLIGATIONS ===
[All monetary terms, payment schedules, penalties, costs]

=== CRITICAL RISKS & RED FLAGS ===
🚨 [List each risk with clear impact assessment]

=== COMPLIANCE & LEGAL REQUIREMENTS ===
[Regulatory obligations, deadlines, legal duties]

=== STRATEGIC RECOMMENDATIONS ===
✓ [3-5 specific, actionable recommendations]

=== TIMELINE & DEADLINES ===
[All critical dates and time-sensitive requirements]

DOCUMENT: "${fileName}"

${text}

Provide CLEAR, STRUCTURED analysis following the sections above. No markdown formatting, use plain text with clear section headers.`;
  
  try {
    console.log("🚀 Calling Gemini API...");
    const result = await callGeminiAPI(text, prompt, 0.1);
    console.log(`✅ GEMINI API SUCCESS: Generated ${result.length} characters`);
    
    if (!result || result.trim().length === 0) {
      throw new Error("Gemini returned empty response");
    }
    
    return result;
  } catch (error) {
    console.error("❌ GEMINI API FAILED:", error);
    console.error("❌ API Key exists:", !!Deno.env.get('GEMINI_API_KEY'));
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}
