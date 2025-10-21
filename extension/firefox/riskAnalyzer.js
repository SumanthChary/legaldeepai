(function () {
  const KEYWORD_RULES = [
    { category: "Termination", weight: 3, pattern: /(terminate|termination|cancel|breach)/i },
    { category: "Liability", weight: 5, pattern: /(liability|indemnif(y|ication)|hold harmless|damages)/i },
    { category: "Confidentiality", weight: 4, pattern: /(confidential|non-disclosure|nda|privacy)/i },
    { category: "Payment", weight: 3, pattern: /(payment terms?|interest|late fee|invoice)/i },
    { category: "Jurisdiction", weight: 2, pattern: /(jurisdiction|governing law|venue)/i },
    { category: "Compliance", weight: 3, pattern: /(gdpr|hipaa|compliance|regulation)/i },
    { category: "Warranty", weight: 2, pattern: /(warrant(y|ies)|guarantee|disclaimer)/i }
  ];

  const SENTIMENT_RULES = [
    { category: "Strict Obligations", weight: 2, pattern: /(must|shall|required to|obligated)/i },
    { category: "High Risk Terms", weight: 3, pattern: /(without limitation|at its sole discretion|non-refundable)/i }
  ];

  function tokenize(text) {
    return text
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);
  }

  function analyzeText(rawText = "") {
    const text = rawText.trim();
    if (!text) {
      return {
        score: 0,
        level: "info",
        wordCount: 0,
        issues: [],
        summary: "No text provided",
      };
    }

    const normalized = text.replace(/\s+/g, " ");
    const tokens = tokenize(normalized);

    const issues = [];
    let score = 0;

    const evaluateRules = (rules, severity) => {
      rules.forEach((rule) => {
        if (rule.pattern.test(normalized)) {
          score += rule.weight * severity;
          issues.push({
            category: rule.category,
            weight: rule.weight * severity,
            snippet: extractSnippet(normalized, rule.pattern),
          });
        }
      });
    };

    evaluateRules(KEYWORD_RULES, 1);
    evaluateRules(SENTIMENT_RULES, 1.5);

    const level = score >= 15 ? "high" : score >= 7 ? "medium" : score > 0 ? "low" : "info";
    const summary = buildSummary(level, issues, tokens.length);

    return {
      score,
      level,
      wordCount: tokens.length,
      issues,
      summary,
    };
  }

  function extractSnippet(text, pattern) {
    const match = text.match(pattern);
    if (!match) return "";
    const index = match.index || 0;
    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + match[0].length + 40);
    return text.slice(start, end).trim();
  }

  function buildSummary(level, issues, wordCount) {
    if (!issues.length) {
      return "No obvious risk indicators detected. Review manually to confirm.";
    }

    const topCategories = Object.entries(
      issues.reduce((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + issue.weight;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category)
      .join(", ");

    return `Detected ${issues.length} risk indicators across ${wordCount} words. Focus on: ${topCategories}. Overall risk level is ${level.toUpperCase()}.`;
  }

  const api = { analyzeText };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    window.LegalDeepRisk = api;
  }
})();
