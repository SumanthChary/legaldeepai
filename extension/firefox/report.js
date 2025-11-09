(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const REPORT_MAP_KEY = "legaldeepAnalysisByTimestamp";
  const RECENT_ANALYSES_KEY = "legaldeepRecentAnalyses";
  const DASHBOARD_URL = "https://legaldeep.ai/dashboard";

  const browserApi = typeof browser !== "undefined" ? browser : typeof chrome !== "undefined" ? chrome : null;
  const hasExtensionStorage = browserApi?.storage?.local;

  const rootEl = document.querySelector(".report-root");
  const summaryTitleEl = document.getElementById("report-document-name");
  const riskChipEl = document.getElementById("report-risk-chip");
  const scoreChipEl = document.getElementById("report-score-chip");
  const wordsChipEl = document.getElementById("report-words-chip");
  const summaryTextEl = document.getElementById("report-summary-text");
  const highlightSectionEl = document.getElementById("report-highlight-section");
  const highlightChipsEl = document.getElementById("report-highlight-chips");
  const updatedEl = document.getElementById("report-updated");
  const sourceEl = document.getElementById("report-source");
  const truncationEl = document.getElementById("report-truncation");
  const issuesListEl = document.getElementById("report-issues");
  const issuesCountEl = document.getElementById("report-issues-count");
  const closeButton = document.getElementById("report-close");
  const dashboardButton = document.getElementById("report-dashboard");

  const storage = hasExtensionStorage
    ? {
        async get(key) {
          const value = await browserApi.storage.local.get(key);
          return value?.[key] ?? null;
        },
        async set(key, data) {
          await browserApi.storage.local.set({ [key]: data });
        },
      }
    : {
        async get(key) {
          try {
            const raw = window.localStorage?.getItem?.(key);
            if (!raw) return null;
            return JSON.parse(raw);
          } catch (error) {
            console.warn("Unable to read report storage", error);
            return null;
          }
        },
        async set(key, data) {
          try {
            const value = typeof data === "string" ? data : JSON.stringify(data);
            window.localStorage?.setItem?.(key, value);
          } catch (error) {
            console.warn("Unable to persist report storage", error);
          }
        },
      };

  function numberFormat(value) {
    try {
      return new Intl.NumberFormat().format(value ?? 0);
    } catch (_error) {
      return String(value ?? 0);
    }
  }

  function describeRisk(level = "info") {
    const normalized = (level || "info").toLowerCase();
    switch (normalized) {
      case "high":
        return "HIGH";
      case "medium":
        return "MED";
      case "low":
        return "LOW";
      default:
        return "INFO";
    }
  }

  function describeSeverity(weight = 0) {
    if (!Number.isFinite(weight)) return "info";
    if (weight >= 8) return "high";
    if (weight >= 4) return "medium";
    if (weight > 0) return "low";
    return "info";
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return "Just now";
    const value = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
    if (!Number.isFinite(value)) return "Just now";
    const diff = Date.now() - value;
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) {
      const minutes = Math.round(diff / 60_000);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }
    if (diff < 86_400_000) {
      const hours = Math.round(diff / 3_600_000);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    const formatter = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return formatter.format(new Date(value));
  }

  async function loadAnalysis(targetTimestamp) {
    if (targetTimestamp) {
      const lookup = await storage.get(REPORT_MAP_KEY);
      if (lookup && typeof lookup === "object" && lookup[targetTimestamp]) {
        return lookup[targetTimestamp];
      }
    }

    if (targetTimestamp) {
      const recent = await storage.get(RECENT_ANALYSES_KEY);
      if (Array.isArray(recent)) {
        const match = recent.find((item) => item?.timestamp === targetTimestamp);
        if (match) {
          return match;
        }
      }
    }

    const fallback = await storage.get(STORAGE_KEY);
    if (fallback) return fallback;
    const recent = await storage.get(RECENT_ANALYSES_KEY);
    if (Array.isArray(recent) && recent.length) {
      return recent[0];
    }
    return null;
  }

  function renderHighlights(issues = []) {
    if (!highlightSectionEl || !highlightChipsEl) return;
    highlightChipsEl.innerHTML = "";

    if (!Array.isArray(issues) || !issues.length) {
      highlightSectionEl.classList.add("hidden");
      return;
    }

    const categoryScores = issues.reduce((acc, issue) => {
      const category = issue?.category || "General";
      const weight = Number.isFinite(issue?.weight) ? issue.weight : 1;
      acc[category] = (acc[category] || 0) + weight;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    if (!topCategories.length) {
      highlightSectionEl.classList.add("hidden");
      return;
    }

    topCategories.forEach(([category, weight]) => {
      const chip = document.createElement("span");
      chip.className = "highlight-chip";
      const severity = describeSeverity(weight);
      chip.textContent = `${category} · ${severity.toUpperCase()}`;
      highlightChipsEl.appendChild(chip);
    });

    highlightSectionEl.classList.remove("hidden");
  }

  function renderIssues(issues = []) {
    if (!issuesListEl) return;
    issuesListEl.innerHTML = "";

    if (!Array.isArray(issues) || !issues.length) {
      const empty = document.createElement("li");
      empty.className = "report-issue-item";
      empty.textContent = "No risk signals flagged.";
      issuesListEl.appendChild(empty);
      if (issuesCountEl) {
        issuesCountEl.textContent = "0";
      }
      return;
    }

    issues.forEach((issue) => {
      const severity = describeSeverity(issue?.weight);
      const item = document.createElement("li");
      item.className = "report-issue-item";

      const header = document.createElement("div");
      header.className = "report-issue-header";

      const category = document.createElement("span");
      category.className = "report-issue-category";
      category.textContent = issue?.category || "General";
      header.appendChild(category);

      const severityBadge = document.createElement("span");
      severityBadge.className = `report-issue-severity ${severity}`;
      severityBadge.textContent = severity.toUpperCase();
      header.appendChild(severityBadge);

      item.appendChild(header);

      if (issue?.snippet) {
        const snippet = document.createElement("p");
        snippet.className = "report-issue-snippet";
        snippet.textContent = issue.snippet;
        item.appendChild(snippet);
      }

      issuesListEl.appendChild(item);
    });

    if (issuesCountEl) {
      issuesCountEl.textContent = `${issues.length}`;
    }
  }

  function applyAnalysis(payload) {
    if (!payload) {
      if (summaryTextEl) {
        summaryTextEl.textContent = "Unable to locate the latest analysis. Run a new upload from the extension.";
      }
      return;
    }

    const { summary, fileName, wordCount, characterCount, level, score, timestamp, source, truncated } = payload;

    if (summaryTitleEl) {
      summaryTitleEl.textContent = fileName || "Detailed analysis";
    }

    if (riskChipEl) {
      const riskClass = (level || "info").toLowerCase();
      riskChipEl.textContent = describeRisk(level);
      riskChipEl.className = `risk-chip risk-${riskClass}`;
    }

    if (scoreChipEl) {
      const value = Number.isFinite(score) ? Math.round(score) : 0;
      scoreChipEl.textContent = `${value}`;
    }

    if (wordsChipEl) {
      if (Number.isFinite(wordCount)) {
        wordsChipEl.textContent = `${numberFormat(wordCount)} words`;
      } else if (Number.isFinite(characterCount)) {
        wordsChipEl.textContent = `${numberFormat(characterCount)} characters`;
      } else {
        wordsChipEl.textContent = "—";
      }
    }

    if (summaryTextEl) {
      summaryTextEl.textContent = summary || "Analysis completed. Review the findings below.";
    }

    if (updatedEl) {
      updatedEl.textContent = formatTimestamp(timestamp);
    }

    if (sourceEl) {
      const labels = { upload: "File", page: "Page", selection: "Selection", custom: "Custom" };
      sourceEl.textContent = labels[source] || "Upload";
    }

    if (truncationEl) {
      truncationEl.textContent = truncated ? "Preview" : "Full";
    }

    renderHighlights(payload.issues);
    renderIssues(payload.issues);
  }

  function openDashboard() {
    const targetUrl = DASHBOARD_URL;
    if (!targetUrl) return;

    if (browserApi?.tabs?.create) {
      browserApi.tabs.create({ url: targetUrl }).catch(() => window.open(targetUrl, "_blank"));
      return;
    }
    window.open(targetUrl, "_blank");
  }

  function closeWindow() {
    window.close();
  }

  async function init() {
    if (dashboardButton) {
      dashboardButton.addEventListener("click", openDashboard);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeWindow);
    }

    const params = new URLSearchParams(window.location.search);
    const timestampParam = params.get("timestamp");
    const targetTimestamp = timestampParam ? Number.parseInt(timestampParam, 10) : null;

    const payload = await loadAnalysis(Number.isFinite(targetTimestamp) ? targetTimestamp : null);
    applyAnalysis(payload);

    if (payload?.fileName && summaryTitleEl) {
      document.title = `LegalDeep · ${payload.fileName}`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    void init();
  }
})();
