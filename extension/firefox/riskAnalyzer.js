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

  const listFormatter = (() => {
    try {
      return new Intl.ListFormat("en", { style: "long", type: "conjunction" });
    } catch (error) {
      return null;
    }
  })();

  function formatCategoryList(items = []) {
    const list = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!list.length) return "";
    if (listFormatter) {
      return listFormatter.format(list);
    }
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
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
    const hasWordCount = Number.isFinite(wordCount) && wordCount > 0;
    const wordCopy = hasWordCount ? `${wordCount.toLocaleString()} words` : "this excerpt";

    if (!issues.length) {
      return `No red flags detected across ${wordCopy}. Give it a quick manual check to confirm.`;
    }

    const categoryScores = issues.reduce((acc, issue) => {
      const category = issue.category || "General";
      const weight = Number.isFinite(issue.weight) ? issue.weight : 1;
      acc[category] = (acc[category] || 0) + weight;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const severityCopy = {
      high: "High-risk clauses dominate this contract.",
      medium: "Medium-level risk language needs careful review.",
      low: "Low-level risk language is present but manageable.",
      info: "Only informational signals were detected.",
    };

    const headline = severityCopy[level] || "Risk indicators detected.";
    const focusCopy = topCategories.length
      ? `Focus on ${formatCategoryList(topCategories)}.`
      : "Risks are spread across multiple areas.";
    const countCopy = `${issues.length} flagged item${issues.length === 1 ? "" : "s"} in ${wordCopy}.`;

    const topIssue = issues
      .slice()
      .sort((a, b) => (Number.isFinite(b.weight) ? b.weight : 1) - (Number.isFinite(a.weight) ? a.weight : 1))[0];

    const rawSnippet = topIssue?.snippet ? topIssue.snippet.replace(/\s+/g, " ").trim() : "";
    const snippet = rawSnippet.length > 140 ? `${rawSnippet.slice(0, 137)}…` : rawSnippet;
    const snippetCopy = snippet ? `Example: “${snippet}”` : "";

    return [headline, countCopy, focusCopy, snippetCopy].filter(Boolean).join(" ");
  }

  const api = { analyzeText };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    window.LegalDeepRisk = api;
  }
})();
