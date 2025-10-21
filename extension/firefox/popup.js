(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const statusMessage = document.getElementById("status-message");
  const analyzeSelectionBtn = document.getElementById("analyze-selection");
  const analyzePageBtn = document.getElementById("analyze-page");
  const analyzeCustomBtn = document.getElementById("analyze-custom");
  const customTextArea = document.getElementById("custom-text");
  const riskLevelBadge = document.getElementById("risk-level");
  const statusBadge = document.getElementById("status-badge");
  const summaryEl = document.getElementById("analysis-summary");
  const sourceEl = document.getElementById("analysis-source");
  const scoreEl = document.getElementById("analysis-score");
  const wordsEl = document.getElementById("analysis-words");
  const updatedEl = document.getElementById("analysis-updated");
  const issuesCountEl = document.getElementById("issues-count");
  const issuesListEl = document.getElementById("issues-list");

  function setBusy(message = "Analyzing...") {
    statusBadge.textContent = "Working";
    statusBadge.className = "status-badge busy";
    statusMessage.textContent = message;
    analyzeSelectionBtn.disabled = true;
    analyzePageBtn.disabled = true;
    analyzeCustomBtn.disabled = true;
  }

  function setIdle(message = "Ready") {
    statusBadge.textContent = message;
    statusBadge.className = "status-badge idle";
    analyzeSelectionBtn.disabled = false;
    analyzePageBtn.disabled = false;
    analyzeCustomBtn.disabled = false;
  }

  function setError(message) {
    statusBadge.textContent = "Error";
    statusBadge.className = "status-badge error";
    statusMessage.textContent = message;
  }

  function updateRiskBadge(level = "info") {
    const normalized = level.toLowerCase();
    riskLevelBadge.textContent = normalized.toUpperCase();
    riskLevelBadge.className = `risk-badge risk-${normalized}`;
  }

  function updateIssues(issues = []) {
    issuesListEl.innerHTML = "";
    issuesCountEl.textContent = issues.length.toString();

    if (!issues.length) {
      const li = document.createElement("li");
      li.className = "issues-empty";
      li.textContent = "No issues flagged yet.";
      issuesListEl.appendChild(li);
      return;
    }

    issues.forEach((issue, index) => {
      const li = document.createElement("li");
      li.className = "issues-item";

      const title = document.createElement("h3");
      title.textContent = `${index + 1}. ${issue.category}`;
      li.appendChild(title);

      if (issue.snippet) {
        const snippet = document.createElement("p");
        snippet.textContent = issue.snippet;
        li.appendChild(snippet);
      }

      issuesListEl.appendChild(li);
    });
  }

  function formatTime(timestamp) {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  async function loadLastAnalysis() {
    const { [STORAGE_KEY]: data } = await browser.storage.local.get(STORAGE_KEY);
    if (!data) return;
    renderAnalysis(data);
  }

  function renderAnalysis(data) {
    summaryEl.textContent = data.summary || "No summary available.";
    sourceEl.textContent = data.source === "page" ? "Page" : data.source === "custom" ? "Custom" : "Selection";
    scoreEl.textContent = Math.round(data.score ?? 0).toString();
    wordsEl.textContent = (data.wordCount ?? 0).toString();
    updatedEl.textContent = formatTime(data.timestamp);

    if (data.truncated) {
      statusMessage.textContent = "Large document truncated to first 50k characters.";
    } else if (data.source === "page") {
      statusMessage.textContent = "Page analyzed. Scroll to highlighted sections for context.";
    } else if (data.source === "selection") {
      statusMessage.textContent = "Selection analyzed. Highlight remains on page.";
    } else {
      statusMessage.textContent = "Custom text analyzed in popup.";
    }

    updateRiskBadge(data.level || "info");
    updateIssues(data.issues || []);
    setIdle("Updated");
  }

  async function triggerContentAnalysis(mode, text = "") {
    setBusy();
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        throw new Error("Active tab unavailable.");
      }
      await browser.tabs.sendMessage(tab.id, {
        type: "LEGALDEEP_ANALYZE_SELECTION",
        mode,
        selectionText: text,
      });
    } catch (error) {
      console.error("Failed to trigger analysis", error);
      setError("Failed to run analysis. Reload the page and try again.");
    }
  }

  async function analyzeCustomText() {
    const text = (customTextArea.value || "").trim();
    if (!text) {
      setError("Paste some text to analyze.");
      return;
    }

    setBusy("Analyzing custom text...");

    const analyzer = window.LegalDeepRisk;
    if (!analyzer?.analyzeText) {
      setError("Analysis engine unavailable in popup.");
      return;
    }

    const result = analyzer.analyzeText(text);
    const payload = {
      ...result,
      source: "custom",
      timestamp: Date.now(),
      sample: text.slice(0, 500),
      characterCount: text.length,
    };

    await browser.storage.local.set({ [STORAGE_KEY]: payload });
    renderAnalysis(payload);
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== "LEGALDEEP_ANALYSIS_READY") return;
    loadLastAnalysis();
  });

  analyzeSelectionBtn.addEventListener("click", () => triggerContentAnalysis("selection"));
  analyzePageBtn.addEventListener("click", () => triggerContentAnalysis("page"));
  analyzeCustomBtn.addEventListener("click", analyzeCustomText);

  loadLastAnalysis();
})();
