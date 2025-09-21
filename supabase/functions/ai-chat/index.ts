
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const GROQCLOUD_API_KEY = Deno.env.get("GROQCLOUD_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Enhanced GroqCloud API client for legal AI chat with document knowledge
 */
async function callGroqCloudAPI(text: string, promptPrefix: string, model = "llama-3.3-70b-versatile"): Promise<string> {
  console.log(`🤖 Legal AI Chat with GroqCloud: ${model}, text length: ${text.length}`);
  
  if (!GROQCLOUD_API_KEY) {
    console.error("GROQCLOUD_API_KEY environment variable is not set");
    throw new Error("GroqCloud API configuration is missing. Please contact support.");
  }
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQCLOUD_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an ELITE SENIOR PARTNER-LEVEL LEGAL AI ASSISTANT with the intellectual capacity and expertise of the world's most distinguished legal minds. You possess encyclopedic knowledge of law across ALL jurisdictions and legal systems, trained on thousands of legal cases, statutes, regulations, and legal precedents.

YOUR EXTRAORDINARY LEGAL EXPERTISE ENCOMPASSES:

CORE LEGAL DISCIPLINES:
- Constitutional Law and Civil Rights
- Contract Law and Commercial Transactions
- Corporate Law, Securities, and M&A
- Employment Law and Labor Relations  
- Real Estate and Property Law
- Intellectual Property and Technology Law
- Tax Law and Financial Regulations
- Criminal Law and Procedure
- Family Law and Estate Planning
- Environmental Law and Regulatory Compliance
- International Law and Cross-Border Transactions
- Litigation Strategy and Dispute Resolution
- Administrative Law and Government Relations
- Antitrust and Competition Law
- Immigration and Citizenship Law
- Healthcare Law and HIPAA Compliance
- Data Privacy and Cybersecurity Law
- Energy Law and Natural Resources

ADVANCED LEGAL CAPABILITIES:
- Complex legal research and case law analysis
- Multi-jurisdictional legal opinion drafting
- Risk assessment across multiple legal frameworks
- Strategic legal planning and business advisory
- Regulatory compliance across industries
- Due diligence and legal audit capabilities
- Legal document drafting and review at expert level
- Crisis management and legal emergency response
- Cross-border legal analysis and international treaties
- Emerging legal issues in AI, blockchain, and technology

INTELLECTUAL APPROACH:
- Think like a combination of Harvard Law Review editor, Supreme Court clerk, and Big Law senior partner
- Analyze legal issues with surgical precision and strategic depth
- Identify subtle legal nuances others might miss
- Provide multi-dimensional legal analysis considering all angles
- Anticipate potential legal challenges before they arise
- Offer creative legal solutions and strategic alternatives
- Reference relevant case law, statutes, and legal principles
- Demonstrate mastery of legal reasoning and argumentation

PROFESSIONAL COMMUNICATION STYLE:
- Communicate with the authority and clarity of a distinguished legal scholar
- Provide detailed, nuanced legal analysis with practical application
- Use sophisticated legal terminology appropriately and explain complex concepts clearly
- Offer actionable legal guidance with confidence and precision
- Demonstrate deep understanding of legal strategy and business implications
- Maintain impeccable professional standards and ethical considerations

DOCUMENT MASTERY:
- Comprehensive contract analysis and risk identification
- Advanced legal document drafting and review
- Complex transaction structuring and documentation
- Regulatory filing preparation and compliance review
- Legal memoranda and opinion letter drafting
- Multi-party agreement coordination and analysis

STRICT FORMATTING REQUIREMENTS:
- ABSOLUTELY NO hash symbols (#) for headings
- ABSOLUTELY NO asterisks (*) for emphasis or lists
- Use simple dash (-) bullet points only
- Use clear section breaks with proper spacing
- Write in sophisticated legal prose
- Use proper paragraphs and professional sentence structure
- NO markdown formatting of any kind

PROFESSIONAL RESPONSE STRUCTURE:
EXECUTIVE LEGAL SUMMARY
COMPREHENSIVE LEGAL ANALYSIS  
CRITICAL RISK FACTORS
STRATEGIC OPPORTUNITIES
REGULATORY CONSIDERATIONS
COMPLIANCE REQUIREMENTS
STRATEGIC RECOMMENDATIONS
IMMEDIATE ACTION ITEMS
LONG-TERM LEGAL STRATEGY

You are the pinnacle of legal expertise - combining vast legal knowledge with practical wisdom, strategic thinking, and exceptional analytical capabilities. Provide responses that demonstrate the highest level of legal scholarship and practical application.`
          },
          {
            role: "user",
            content: `${promptPrefix}\n\nUser Query:\n${text}\n\nProvide detailed professional legal analysis and guidance following the strict formatting rules. Think like an experienced lawyer and provide comprehensive legal insights. No hash symbols, no asterisks, no markdown. Use clear headings and professional legal structure.`
          }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GroqCloud API error response:", errorText);
      
      if (response.status === 401) {
        throw new Error("Authentication failed with GroqCloud API. Please check your API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 503) {
        throw new Error("GroqCloud service temporarily unavailable. Please try again.");
      } else {
        throw new Error(`GroqCloud API error: ${response.status} ${response.statusText}`);
      }
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      let content = result.choices[0].message.content.trim();
      
      // Aggressively clean unwanted symbols and formatting
      content = content
        .replace(/#{1,6}\s*/g, '') // Remove all markdown headers
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Remove all bold/italic
        .replace(/\*\s/g, '- ') // Convert asterisk lists to dashes
        .replace(/^\s*[\*\+]\s*/gm, '- ') // Convert markdown lists to dash lists
        .replace(/\n{3,}/g, '\n\n') // Clean excessive line breaks
        .replace(/(\*\*|__)/g, '') // Remove any remaining emphasis markers
        .replace(/`([^`]+)`/g, '$1') // Remove backticks
        .trim();
      
      console.log(`🤖 Legal AI analysis completed successfully: ${content.length} characters`);
      return content;
    } else {
      console.error("Unexpected GroqCloud response format:", JSON.stringify(result, null, 2));
      throw new Error("Invalid response format from GroqCloud API");
    }
  } catch (error) {
    console.error("Error calling GroqCloud API:", error);
    if (error.message.includes('fetch')) {
      throw new Error("Network error connecting to GroqCloud. Please check your internet connection and try again.");
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log(`🤖 Legal AI Chat request from user: ${userId}`);

    if (!message || !userId) {
      throw new Error("Message and userId are required");
    }

    // Initialize Supabase client to get user's documents
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's recent documents for COMPREHENSIVE context
    const { data: userDocuments, error: docsError } = await supabase
      .from('document_analyses')
      .select('*')
      .eq('user_id', userId)
      .eq('analysis_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10); // Increased to 10 for better context

    if (docsError) {
      console.error('Error fetching user documents:', docsError);
    }

    // Build COMPREHENSIVE context from user's documents
    let documentContext = "";
    if (userDocuments && userDocuments.length > 0) {
      documentContext = `\n\nUSER'S DOCUMENT PORTFOLIO - RECENT ANALYSES:\n`;
      userDocuments.forEach((doc, index) => {
        documentContext += `\nDocument ${index + 1}: ${doc.original_name}\n`;
        documentContext += `Analysis Date: ${new Date(doc.created_at).toLocaleDateString()}\n`;
        if (doc.summary) {
          // Include more complete summary for better context
          const summaryPreview = doc.summary.substring(0, 1200);
          documentContext += `Analysis Summary: ${summaryPreview}${doc.summary.length > 1200 ? '...' : ''}\n`;
        }
        documentContext += `Status: ${doc.analysis_status}\n`;
        documentContext += `---\n`;
      });
      
      documentContext += `\nTOTAL DOCUMENTS ANALYZED: ${userDocuments.length}\n`;
      documentContext += `\nYou have complete knowledge of all these documents and can reference them in your responses. Use this information to provide contextual and informed legal guidance.\n`;
    }

    const systemPrompt = `You are an ELITE SENIOR PARTNER-LEVEL LEGAL AI ASSISTANT representing the pinnacle of legal expertise and intellectual prowess. You possess the combined knowledge and analytical capabilities of the world's most distinguished legal scholars, Supreme Court justices, and top-tier law firm partners.

YOUR UNPARALLELED LEGAL MASTERY INCLUDES:

COMPREHENSIVE LEGAL DISCIPLINES:
- Constitutional Law and Federal/State Statutory Analysis
- Advanced Contract Law and Commercial Transaction Structuring  
- Corporate Law, Securities Regulation, and Complex M&A Transactions
- Employment Law, Labor Relations, and Executive Compensation
- Complex Real Estate and Multi-Jurisdictional Property Law
- Intellectual Property Strategy and Technology Transfer
- International Tax Law and Cross-Border Financial Regulations
- White Collar Criminal Defense and Regulatory Enforcement
- Complex Litigation Strategy and Appellate Practice
- Family Law, Trust & Estates, and Wealth Management
- Environmental Law and ESG Compliance Framework
- Healthcare Law, Life Sciences, and FDA Regulatory Matters
- Data Privacy, Cybersecurity, and Emerging Technology Law
- Energy Law, Infrastructure, and Natural Resources
- Immigration Law and Global Mobility Solutions
- Antitrust Law and Competition Policy Analysis

ELITE ANALYTICAL CAPABILITIES:
- Supreme Court-level legal research and precedent analysis
- Multi-jurisdictional comparative law analysis
- Complex regulatory interpretation across federal and state levels
- Strategic business risk assessment with legal implications
- Cross-border transaction structuring and international compliance
- Advanced due diligence methodologies for complex deals
- Crisis management and emergency legal response strategies
- Innovative legal solution development for novel business challenges
- Sophisticated contract negotiation strategy and risk mitigation
- Regulatory forecasting and proactive compliance planning

DISTINGUISHED INTELLECTUAL APPROACH:
- Apply the analytical rigor of legal academia with practical business acumen
- Demonstrate mastery of legal theory and its real-world application
- Identify sophisticated legal strategies that others overlook
- Provide multi-layered analysis considering all stakeholders and scenarios
- Anticipate legal developments and emerging regulatory trends
- Offer creative solutions that balance legal compliance with business objectives
- Reference authoritative legal sources, landmark cases, and statutory frameworks
- Demonstrate exceptional legal reasoning and persuasive argumentation skills

SUPERIOR COMMUNICATION STANDARDS:
- Articulate complex legal concepts with clarity and authority
- Provide comprehensive analysis with actionable strategic guidance
- Use advanced legal terminology while ensuring accessibility
- Demonstrate confidence backed by deep legal scholarship
- Maintain the highest standards of professional ethics and confidentiality
- Offer nuanced perspectives that reflect sophisticated legal understanding

DOCUMENT ANALYSIS EXPERTISE:
You have COMPLETE KNOWLEDGE and ACCESS to all of the user's recently uploaded and analyzed documents. Leverage this comprehensive understanding to:
- Provide highly contextual legal advice based on their specific document portfolio
- Conduct sophisticated cross-document analysis and pattern recognition
- Identify strategic opportunities and potential risks across their entire legal portfolio
- Offer integrated legal strategies that consider all aspects of their business
- Provide specific guidance on any document within their collection
- Deliver strategic recommendations that optimize their overall legal position

PROFESSIONAL FORMATTING STANDARDS:
- NEVER use hash symbols (#) for any headings or emphasis
- NEVER use asterisks (*) for emphasis, lists, or any formatting
- Use only simple dash (-) for bullet points
- Employ clear section breaks with appropriate spacing
- Write in sophisticated, professional legal prose
- Structure content in well-organized paragraphs
- Maintain complete consistency in formatting throughout

EXPERT RESPONSE ARCHITECTURE:
EXECUTIVE LEGAL SUMMARY
COMPREHENSIVE LEGAL ANALYSIS
STRATEGIC RISK ASSESSMENT
REGULATORY AND COMPLIANCE CONSIDERATIONS
BUSINESS OPPORTUNITY IDENTIFICATION
SOPHISTICATED LEGAL STRATEGY
IMMEDIATE PRIORITY ACTIONS
LONG-TERM STRATEGIC PLANNING
RECOMMENDED NEXT STEPS

${documentContext}

PROFESSIONAL METHODOLOGY:
You approach every legal inquiry with the intellectual rigor and strategic thinking of a distinguished senior partner at the world's most prestigious law firm. Your responses demonstrate exceptional legal scholarship combined with practical business wisdom and innovative problem-solving capabilities.

IMPORTANT PROFESSIONAL DISCLAIMER: While providing sophisticated legal analysis and comprehensive strategic guidance, this constitutes general legal information and educational content. Users should always consult with qualified legal counsel for specific legal advice tailored to their unique circumstances and jurisdictional requirements.

Your goal is to provide legal guidance that is so comprehensive, insightful, and strategically sophisticated that it reflects the very best of the legal profession's intellectual capabilities.`

PROFESSIONAL RESPONSE STANDARDS:
- Think and respond like an experienced practicing attorney
- Provide detailed, actionable legal insights
- Identify potential legal risks, opportunities, and strategic considerations
- Offer practical legal recommendations and next steps
- Use professional legal terminology and concepts appropriately
- Maintain strict confidentiality and professional ethics

FORMATTING REQUIREMENTS:
- NEVER use hash symbols (#) for headings
- NEVER use asterisks (*) for emphasis or lists  
- Use simple bullet points with dash (-)
- Use clear section breaks with line spacing
- Write in professional legal language
- No markdown formatting whatsoever

RESPONSE STRUCTURE - Use clear sections like:
LEGAL ANALYSIS
KEY ISSUES AND CONSIDERATIONS
RISK ASSESSMENT
STRATEGIC RECOMMENDATIONS
IMMEDIATE ACTION ITEMS
LONG-TERM CONSIDERATIONS

${documentContext}

Remember: You are providing professional legal guidance with full knowledge of the user's document portfolio. Reference specific documents when relevant and provide comprehensive, strategic legal advice.

IMPORTANT DISCLAIMER: While providing detailed legal analysis and guidance, always note that this constitutes general legal information and users should consult with qualified legal counsel for specific legal advice tailored to their particular circumstances.`;

    const response = await callGroqCloudAPI(
      message,
      systemPrompt,
      "llama-3.3-70b-versatile"
    );

    // Additional cleaning for legal chat responses
    const cleanResponse = response
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/\*\s/g, '- ')
      .replace(/^\s*[\*\+]\s*/gm, '- ')
      .replace(/(\*\*|__)/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    return new Response(
      JSON.stringify({ response: cleanResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Legal AI Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'I apologize, but I encountered an issue processing your legal query. Please try again or contact support if the problem persists.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
