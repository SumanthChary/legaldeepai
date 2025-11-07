(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const RECENT_ANALYSES_KEY = "legaldeepRecentAnalyses";
  const ANALYSIS_COUNT_KEY = "legaldeepAnalysisCount";
  const RISK_COUNT_KEY = "legaldeepRiskCount";
  const RECENT_LIMIT = 5;
  const hasExtensionStorage = typeof browser !== "undefined" && browser?.storage?.local;

  const dropzone = document.getElementById("upload-window-dropzone");
  const chooseButton = document.getElementById("upload-window-button");
  const fileInput = document.getElementById("upload-window-input");
  const statusEl = document.getElementById("upload-window-status");
  const resultSection = document.getElementById("upload-window-result");
  const levelBadge = document.getElementById("upload-window-level");
  const wordsBadge = document.getElementById("upload-window-words");
  const issuesBadge = document.getElementById("upload-window-issues-count");
  const summaryText = document.getElementById("upload-window-summary-text");
  const issuesList = document.getElementById("upload-window-issues");
  const closeButton = document.getElementById("upload-window-close");

  const uploadToolkit = window.LegalDeepUpload || null;
  const analyzer = window.LegalDeepRisk || null;

  const objectStorage = hasExtensionStorage
    ? {
        async get(key) {
          const result = await browser.storage.local.get(key);
          return result?.[key] ?? null;
        },
        async set(key, value) {
          await browser.storage.local.set({ [key]: value });
        },
        async remove(key) {
          await browser.storage.local.remove(key);
        },
      }
    : {
        async get(key) {
          try {
            const raw = window.localStorage?.getItem?.(key);
            if (!raw) return null;
            return JSON.parse(raw);
          } catch (error) {
            console.warn("Unable to read upload window storage", error);
            return null;
          }
        },
        async set(key, value) {
          try {
            const serialized = typeof value === "string" ? value : JSON.stringify(value);
            window.localStorage?.setItem?.(key, serialized);
          } catch (error) {
            console.warn("Unable to persist upload window storage", error);
          }
        },
        async remove(key) {
          try {
            window.localStorage?.removeItem?.(key);
          } catch (error) {
            console.warn("Unable to clear upload window storage", error);
          }
        },
      };

  let recentAnalyses = [];
  let totalAnalyses = 0;
  let totalRiskFindings = 0;

  function setStatus(message, variant = "idle") {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("busy", "error", "success");
    if (variant !== "idle") {
      statusEl.classList.add(variant);
    }
  }

  function describeRisk(level = "info") {
    switch (level) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "Info";
    }
  }

  async function loadState() {
    const storedRecent = await objectStorage.get(RECENT_ANALYSES_KEY);
    recentAnalyses = Array.isArray(storedRecent) ? storedRecent : [];
    const storedAnalyses = await objectStorage.get(ANALYSIS_COUNT_KEY);
    const storedRisks = await objectStorage.get(RISK_COUNT_KEY);
    totalAnalyses = Number.isFinite(storedAnalyses) ? storedAnalyses : Number(storedAnalyses) || 0;
    totalRiskFindings = Number.isFinite(storedRisks) ? storedRisks : Number(storedRisks) || 0;
  }

  async function persistRecentAnalysis(payload) {
    if (!payload?.timestamp) {
      return { isNew: false, list: recentAnalyses };
    }

    const existing = Array.isArray(recentAnalyses) ? recentAnalyses : [];
    const alreadyExists = existing.some((item) => item.timestamp === payload.timestamp);
    const filtered = existing.filter((item) => item.timestamp !== payload.timestamp);
    const updated = [payload, ...filtered].slice(0, RECENT_LIMIT);
    recentAnalyses = updated;
    await objectStorage.set(RECENT_ANALYSES_KEY, updated);
    return { isNew: !alreadyExists, list: updated };
  }

  async function applyAnalysisResult(payload) {
    if (!payload) return;

    await objectStorage.set(STORAGE_KEY, payload);
    const result = await persistRecentAnalysis(payload);

    if (result.isNew) {
      totalAnalyses += 1;
      await objectStorage.set(ANALYSIS_COUNT_KEY, totalAnalyses);
      const riskAddition = Array.isArray(payload.issues) ? payload.issues.length : 0;
      totalRiskFindings += riskAddition;
      await objectStorage.set(RISK_COUNT_KEY, totalRiskFindings);
    }
  }

  function renderResult(payload) {
    if (!payload) return;
    resultSection.classList.remove("hidden");
    levelBadge.textContent = describeRisk(payload.level);
    levelBadge.className = "pill";
    levelBadge.classList.add(payload.level ? `risk-${payload.level}` : "risk-info");
    wordsBadge.textContent = `${(payload.wordCount ?? 0).toLocaleString()} words`;
    issuesBadge.textContent = `${Array.isArray(payload.issues) ? payload.issues.length : 0} issues`;

    summaryText.textContent = payload.summary || "No summary available.";

    issuesList.innerHTML = "";
    if (Array.isArray(payload.issues) && payload.issues.length) {
      payload.issues.forEach((issue) => {
        const item = document.createElement("li");
        item.textContent = issue.snippet ? `${issue.category}: ${issue.snippet}` : issue.category;
        issuesList.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "No issues flagged.";
      issuesList.appendChild(item);
    }
  }

  async function processFile(file) {
    if (!uploadToolkit?.prepareFileForAnalysis) {
      setStatus("Upload helper unavailable. Reload this window.", "error");
      return;
    }

    if (!analyzer?.analyzeText) {
      setStatus("Analysis engine unavailable. Reload the extension.", "error");
      return;
    }

    const preparation = await uploadToolkit.prepareFileForAnalysis(file);
    if (!preparation.ok) {
      setStatus(preparation.message || "Unable to process that file.", "error");
      return;
    }

    setStatus("Analyzing uploaded document...", "busy");

    try {
      const result = analyzer.analyzeText(preparation.truncatedText);
      const summaryFromAnalyzer = typeof result.summary === "string" ? result.summary.trim() : "";
      const payload = {
        ...result,
        summary: summaryFromAnalyzer || (file.name ? `Analysis for ${file.name}` : "Uploaded document analysis"),
        source: "upload",
        timestamp: Date.now(),
        sample: preparation.truncatedText.slice(0, 500),
        characterCount: preparation.originalLength,
        truncated: preparation.truncated,
        fileName: file.name || null,
      };

      await applyAnalysisResult(payload);
      renderResult(payload);
      setStatus("Analysis saved to the popup. You can close this window.", "success");

      try {
        await browser.runtime.sendMessage({ type: "LEGALDEEP_ANALYSIS_READY" });
      } catch (error) {
        // Popup may not be open; ignore.
      }
    } catch (error) {
      console.error("Failed to analyze uploaded file in window", error);
      setStatus("Unable to analyze that file. Try again or use the dashboard.", "error");
    }
  }

  function handleFiles(files) {
    if (!files?.length) return;
    const [file] = files;
    void processFile(file);
  }

  function setupDragAndDrop() {
    if (!dropzone) return;

    const preventDefaults = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        () => {
          dropzone.classList.add("is-dragover");
        },
        false,
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        () => {
          dropzone.classList.remove("is-dragover");
        },
        false,
      );
    });

    dropzone.addEventListener(
      "drop",
      (event) => {
        const files = event.dataTransfer?.files;
        handleFiles(files);
      },
      false,
    );
  }

  function setupFileInput() {
    if (chooseButton && fileInput) {
      chooseButton.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener("change", (event) => {
        const files = event.target?.files;
        handleFiles(files);
        fileInput.value = "";
      });
    }
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      window.close();
    });
  }

  void loadState();
  setupDragAndDrop();
  setupFileInput();
  setStatus("Select or drop a file to analyze it instantly.");
})();
