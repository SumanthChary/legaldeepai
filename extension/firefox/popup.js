(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const SUPABASE_URL = "https://nhmhqhhxlcmhufxxifbn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obWhxaGh4bGNtaHVmeHhpZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODYxMjYsImV4cCI6MjA1MzQ2MjEyNn0.IHb10FPooqBbe06KiR8eSHRlpkJmJtj_4iahFpRDu7M";
  const DASHBOARD_URL = "https://legaldeep.ai/dashboard";
  const BILLING_URL = "https://legaldeep.ai/payment";
  const PRICING_URL = "https://legaldeep.ai/pricing";
  const SUPPORT_URL = "https://legaldeep.ai/contact";
  const PROFILE_STORAGE_KEY = "legaldeepProfile";
  const AUTH_STORAGE_KEY = "legaldeepAuthState";
  const RECENT_ANALYSES_KEY = "legaldeepRecentAnalyses";
  const ANALYSIS_COUNT_KEY = "legaldeepAnalysisCount";
  const RISK_COUNT_KEY = "legaldeepRiskCount";
  const RECENT_LIMIT = 5;
  const hasExtensionStorage = typeof browser !== "undefined" && browser?.storage?.local;

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
  const issuesEmptyEl = document.getElementById("issues-empty");
  const highlightsSection = document.getElementById("analysis-highlights");
  const highlightChipsEl = document.getElementById("analysis-highlight-chips");
  const analysisActionsEl = document.getElementById("analysis-actions");
  const openReportBtn = document.getElementById("open-report");
  const planBadge = document.getElementById("plan-badge");
  const accountCard = document.getElementById("account-card");
  const accountEmail = document.getElementById("account-email");
  const accountPlan = document.getElementById("account-plan");
  const accountUpdated = document.getElementById("account-updated");
  const accountUsage = document.getElementById("account-usage");
  const statContractsEl = document.getElementById("stat-contracts");
  const statRisksEl = document.getElementById("stat-risks");
  const authPanel = document.getElementById("auth-panel");
  const loginForm = document.getElementById("login-form");
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  const loginButton = document.getElementById("login-button");
  const openDashboardBtn = document.getElementById("open-dashboard");
  const authError = document.getElementById("auth-error");
  const subscriptionWarning = document.getElementById("subscription-warning");
  const manageBillingBtn = document.getElementById("manage-billing");
  const logoutButton = document.getElementById("logout-button");
  const manageAccountBtn = document.getElementById("manage-account");
  const uploadFileBtn = document.getElementById("upload-file");
  const uploadFileInput = document.getElementById("upload-file-input");
  const viewPricingBtn = document.getElementById("view-pricing");
  const subscriptionHelpBtn = document.getElementById("subscription-help");
  const recentListEl = document.getElementById("recent-analyses-list");
  const recentEmptyEl = document.getElementById("recent-empty-state");
  const gatedSections = Array.from(document.querySelectorAll(".gated"));
  const bodyEl = document.body;

  const uploadToolkit = window.LegalDeepUpload || null;
  const uploadDropzone = document.getElementById("upload-dropzone");
  const uploadStatusEl = document.getElementById("upload-status");
  const uploadHandoffHintEl = document.getElementById("upload-handoff-hint");
  const uploadSubtitleEl = document.querySelector(".upload-drop-subtitle");
  let defaultUploadStatus =
    uploadStatusEl?.textContent?.trim() || "Drop or choose a file to analyze it instantly.";
  const isFirefox = typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent || "");
  const uploadWorkspaceUrl =
    typeof browser !== "undefined" && browser?.runtime?.getURL ? browser.runtime.getURL("upload.html") : "upload.html";
  if (uploadStatusEl) {
    uploadStatusEl.dataset.state = "idle";
  }

  if (isFirefox) {
    if (uploadSubtitleEl) {
      uploadSubtitleEl.textContent = "Opens the upload workspace in a separate window";
    }
    defaultUploadStatus =
      "Open the upload workspace to analyze files without closing the popup.";
    if (uploadStatusEl) {
      uploadStatusEl.textContent = defaultUploadStatus;
      uploadStatusEl.dataset.state = "idle";
    }
    if (uploadHandoffHintEl) {
      uploadHandoffHintEl.classList.remove("hidden");
    }
  }

  if (isFirefox && uploadFileInput) {
    uploadFileInput.setAttribute("disabled", "disabled");
  }

  if (customTextArea && !customTextArea.dataset.defaultPlaceholder) {
    customTextArea.dataset.defaultPlaceholder = customTextArea.getAttribute("placeholder") || "";
  }

  [accountPlan, planBadge].forEach((element) => {
    if (element && !element.dataset.baseClass) {
      element.dataset.baseClass = element.className;
    }
  });

  const supabaseStorage = hasExtensionStorage
    ? {
        async getItem(key) {
          const result = await browser.storage.local.get(key);
          return typeof result[key] === "undefined" ? null : result[key];
        },
        async setItem(key, value) {
          await browser.storage.local.set({ [key]: value });
        },
        async removeItem(key) {
          await browser.storage.local.remove(key);
        },
      }
    : {
        async getItem(key) {
          try {
            return window.localStorage?.getItem?.(key) ?? null;
          } catch (error) {
            console.warn("Unable to read auth session from localStorage", error);
            return null;
          }
        },
        async setItem(key, value) {
          try {
            window.localStorage?.setItem?.(key, value);
          } catch (error) {
            console.warn("Unable to persist auth session", error);
          }
        },
        async removeItem(key) {
          try {
            window.localStorage?.removeItem?.(key);
          } catch (error) {
            console.warn("Unable to clear auth session", error);
          }
        },
      };

  const objectStorage = hasExtensionStorage
    ? {
        async get(key) {
          const result = await browser.storage.local.get(key);
          return typeof result[key] === "undefined" ? null : result[key];
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
            console.warn("Unable to parse stored data", error);
            return null;
          }
        },
        async set(key, value) {
          try {
            const serialized = typeof value === "string" ? value : JSON.stringify(value);
            window.localStorage?.setItem?.(key, serialized);
          } catch (error) {
            console.warn("Unable to persist data", error);
          }
        },
        async remove(key) {
          try {
            window.localStorage?.removeItem?.(key);
          } catch (error) {
            console.warn("Unable to remove stored data", error);
          }
        },
      };

  const numberFormat = new Intl.NumberFormat();

  function toNumber(value, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
  }

  function formatCount(value) {
    return numberFormat.format(toNumber(value, 0));
  }

  function describeSource(source) {
    switch (source) {
      case "page":
        return "Page";
      case "custom":
        return "Custom";
      case "selection":
        return "Selection";
      case "upload":
        return "File";
      default:
        return "Unknown";
    }
  }

  function describeRisk(level) {
    if (!level) return "INFO";
    const normalized = level.toUpperCase();
    return normalized;
  }

  async function getStoredNumber(key) {
    const value = await objectStorage.get(key);
    if (value === null || typeof value === "undefined") return 0;
    return toNumber(value, 0);
  }

  function updateUsageIndicators() {
    if (accountUsage) {
      const limit = cachedProfile?.document_limit;
      if (Number.isFinite(limit) && limit > 0) {
        const used = Math.min(totalAnalyses, limit);
        const remaining = Math.max(limit - used, 0);
        accountUsage.textContent = `${formatCount(used)} / ${formatCount(limit)} analyses (${formatCount(remaining)} left)`;
      } else {
        accountUsage.textContent = `${formatCount(totalAnalyses)} analyses`;
      }
    }

    if (statContractsEl) {
      statContractsEl.textContent = formatCount(totalAnalyses);
    }
  }

  function updateRiskMetric() {
    if (statRisksEl) {
      statRisksEl.textContent = formatCount(totalRiskFindings);
    }
  }

  let supabaseClient = null;
  let currentUser = null;
  let currentSubscription = null;
  let hasAccess = false;
  let cachedProfile = null;
  let subscriptionFetched = false;
  let busy = false;
  let totalAnalyses = 0;
  let totalRiskFindings = 0;
  let recentAnalyses = [];
  let latestAnalysisTimestamp = null;

  async function clearCachedAnalysis() {
    try {
      await objectStorage.remove(STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear cached analysis", error);
    }
    latestAnalysisTimestamp = null;
    updateReportButtonVisibility(false);
    updateReportButtonDisabledState();
  }

  async function loadCachedProfile(userId) {
    if (!userId) {
      cachedProfile = null;
      return;
    }

    try {
      const stored = await objectStorage.get(PROFILE_STORAGE_KEY);
      if (stored && stored.userId === userId) {
        cachedProfile = stored;
      } else {
        cachedProfile = null;
      }
    } catch (error) {
      console.warn("Unable to load cached profile", error);
      cachedProfile = null;
    }
  }

  async function persistProfile(profile) {
    if (!profile?.userId) return;

    const payload = {
      userId: profile.userId,
      email: profile.email || "",
      username: profile.username || "",
      document_limit: profile.document_limit ?? null,
      last_login: profile.last_login || null,
      updated_at: profile.updated_at || null,
      subscription: profile.subscription || null,
      fetchedAt: profile.fetchedAt ?? Date.now(),
    };

    cachedProfile = payload;

    try {
      await objectStorage.set(PROFILE_STORAGE_KEY, payload);
    } catch (error) {
      console.warn("Unable to persist profile cache", error);
    }
  }

  async function clearProfileCache() {
    cachedProfile = null;
    try {
      await objectStorage.remove(PROFILE_STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear cached profile", error);
    }
  }

  async function loadUsageCounters() {
    totalAnalyses = await getStoredNumber(ANALYSIS_COUNT_KEY);
    totalRiskFindings = await getStoredNumber(RISK_COUNT_KEY);
    updateUsageIndicators();
    updateRiskMetric();
  }

  function renderRecentAnalyses(list) {
    if (!recentListEl || !recentEmptyEl) return;
    recentListEl.innerHTML = "";

    if (!list.length) {
      recentListEl.appendChild(recentEmptyEl);
      recentEmptyEl.classList.remove("hidden");
      return;
    }

    recentEmptyEl.classList.add("hidden");

    list.forEach((item) => {
      const entry = document.createElement("li");
      entry.className = "recent-item";

      const summary = document.createElement("p");
      summary.className = "recent-summary";
      summary.textContent = item.summary || "Analysis completed";
      entry.appendChild(summary);

      const meta = document.createElement("div");
      meta.className = "recent-meta";

      const source = document.createElement("span");
      source.textContent = describeSource(item.source);
      meta.appendChild(source);

      const risk = document.createElement("span");
      risk.textContent = describeRisk(item.level);
      meta.appendChild(risk);

      if (item.timestamp) {
        const time = document.createElement("span");
        time.textContent = formatRelativeTimestamp(item.timestamp);
        meta.appendChild(time);
      }

      const issues = Array.isArray(item.issues) ? item.issues.length : 0;
      const issueBadge = document.createElement("span");
      issueBadge.textContent = `${issues} issue${issues === 1 ? "" : "s"}`;
      meta.appendChild(issueBadge);

      entry.appendChild(meta);
      recentListEl.appendChild(entry);
    });
  }

  async function loadRecentAnalysesFromStorage() {
    const stored = await objectStorage.get(RECENT_ANALYSES_KEY);
    recentAnalyses = Array.isArray(stored) ? stored : [];
    renderRecentAnalyses(recentAnalyses);
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
    renderRecentAnalyses(updated);
    return { isNew: !alreadyExists, list: updated };
  }

  async function applyAnalysisResult(payload, { persistRecent = true } = {}) {
    if (!payload) return;

    await objectStorage.set(STORAGE_KEY, payload);

    let isNew = false;
    if (persistRecent) {
      const result = await persistRecentAnalysis(payload);
      isNew = result.isNew;
    }

    if (isNew) {
      totalAnalyses += 1;
      await objectStorage.set(ANALYSIS_COUNT_KEY, totalAnalyses);
      const riskAddition = Array.isArray(payload.issues) ? payload.issues.length : 0;
      totalRiskFindings += riskAddition;
      await objectStorage.set(RISK_COUNT_KEY, totalRiskFindings);
      updateUsageIndicators();
      updateRiskMetric();
    }

    renderAnalysis(payload);
    latestAnalysisTimestamp = payload.timestamp || Date.now();
    updateReportButtonVisibility(true);
    updateReportButtonDisabledState();
  }

  function formatRelativeTimestamp(timestamp) {
    if (!timestamp) return "Just now";
    const value = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
    if (!Number.isFinite(value)) return "Just now";
    const diff = Date.now() - value;
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) {
      const minutes = Math.round(diff / 60_000);
      return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    }
    if (diff < 86_400_000) {
      const hours = Math.round(diff / 3_600_000);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    const date = new Date(value);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function setPlanPillState(element, variant) {
    if (!element) return;
    const base = element.dataset.baseClass || element.className;
    element.className = base;
    if (variant) {
      element.classList.add(variant);
    }
  }

  function renderAccountCard() {
    const shouldShow = Boolean(currentUser);
    toggleElement(accountCard, shouldShow);

    if (!shouldShow) return;

    const subscription = currentSubscription || cachedProfile?.subscription || null;
    const allowanceDescription = describeProfileAllowance(cachedProfile);
    const variant = hasAccess
      ? "success"
      : subscription
        ? "warning"
        : allowanceDescription
          ? "success"
          : "idle";

    if (accountEmail) {
      accountEmail.textContent = cachedProfile?.email || currentUser?.email || "—";
    }

    if (accountPlan) {
      const planLabel = subscription
        ? describeSubscription(subscription, { whenMissing: "No active plan" })
        : allowanceDescription || "No active plan";
      accountPlan.textContent = planLabel;
      setPlanPillState(accountPlan, variant);
    }

    if (planBadge) {
      const whenMissing = currentUser ? "No active plan" : "Sign in required";
      const badgeText = subscription
        ? describeSubscription(subscription, { whenMissing })
        : allowanceDescription || whenMissing;
      planBadge.textContent = badgeText;
      setPlanPillState(planBadge, variant);
    }

    if (accountUpdated) {
      const timestamp = cachedProfile?.fetchedAt || cachedProfile?.updated_at || null;
      accountUpdated.textContent = timestamp ? formatRelativeTimestamp(timestamp) : "—";
    }

    updateUsageIndicators();
  }

  function setAuthError(message = "") {
    if (authError) {
      authError.textContent = message;
    }
  }

  function setUploadStatus(message, variant = "idle") {
    if (!uploadStatusEl) return;
    const nextMessage = message || defaultUploadStatus;
    uploadStatusEl.textContent = nextMessage;
    uploadStatusEl.classList.remove("busy", "error", "success", "warning");
    if (variant && variant !== "idle") {
      uploadStatusEl.classList.add(variant);
    }
    uploadStatusEl.dataset.state = variant || "idle";
  }

  function toggleElement(element, show) {
    if (!element) return;
    element.classList.toggle("hidden", !show);
  }

  function updateReportButtonVisibility(force) {
    if (!analysisActionsEl || !openReportBtn) return;
    const shouldShow = typeof force === "boolean" ? force : Boolean(latestAnalysisTimestamp);
    analysisActionsEl.classList.toggle("hidden", !shouldShow);
  }

  function updateReportButtonDisabledState() {
    if (!openReportBtn) return;
    const disabled = !hasAccess || busy || !latestAnalysisTimestamp;
    openReportBtn.disabled = disabled;
  }

  function refreshControls() {
    const disabled = !hasAccess || busy;
    if (analyzeSelectionBtn) analyzeSelectionBtn.disabled = disabled;
    if (analyzePageBtn) analyzePageBtn.disabled = disabled;
    if (analyzeCustomBtn) analyzeCustomBtn.disabled = disabled;
    if (logoutButton) logoutButton.disabled = !currentUser;
    if (uploadFileBtn) uploadFileBtn.disabled = disabled;
  if (uploadFileInput) uploadFileInput.disabled = disabled || isFirefox;
    updateReportButtonDisabledState();
    if (customTextArea) {
      customTextArea.disabled = disabled;
      const placeholder = customTextArea.dataset.defaultPlaceholder || "";
      const lockedCopy = currentUser
        ? "Activate your plan to unlock custom analysis"
        : "Sign in to unlock custom analysis";
      customTextArea.placeholder = disabled ? lockedCopy : placeholder;
    }
  }

  function refreshUploadStatusForAccess() {
    if (!uploadStatusEl || busy) return;
    const state = uploadStatusEl.dataset.state || "idle";
    if (state === "busy" || state === "success") {
      return;
    }

    if (!currentUser) {
      setUploadStatus("Sign in to upload and analyze files.", "warning");
    } else if (!hasAccess) {
      setUploadStatus("Activate your plan to unlock file uploads.", "warning");
    } else {
      setUploadStatus(defaultUploadStatus, "idle");
    }
  }

  function openUploadWorkspace() {
    if (!hasAccess) {
      setUploadStatus("Activate your plan to unlock file uploads.", "warning");
      setError("Activate your plan to upload and analyze documents.");
      return;
    }

    if (!uploadWorkspaceUrl) {
      setUploadStatus("Upload workspace unavailable. Reload and try again.", "error");
      setError("Upload workspace unavailable. Reload and try again.");
      return;
    }

    setUploadStatus("Opening the upload workspace in a new window...", "busy");

    const fallbackFeatures = "width=520,height=720,resizable=yes,scrollbars=yes";

    void (async () => {
      if (typeof browser !== "undefined" && browser?.windows?.create) {
        try {
          await browser.windows.create({
            url: uploadWorkspaceUrl,
            type: "popup",
            width: 520,
            height: 720,
          });
          setUploadStatus("Upload workspace opened. Results sync automatically.", "success");
          return;
        } catch (apiError) {
          console.warn("Unable to open upload workspace via browser.windows.create", apiError);
        }
      }

      try {
        window.open(uploadWorkspaceUrl, "_blank", fallbackFeatures);
        setUploadStatus("Upload workspace opened. Results sync automatically.", "success");
      } catch (fallbackError) {
        console.error("Unable to open upload workspace", fallbackError);
        setUploadStatus("Couldn't open the upload workspace. Try again.", "error");
        setError("Unable to open upload workspace. Try again.");
      }
    })();
  }

  function openReportView() {
    const baseUrl = typeof browser !== "undefined" && browser.runtime?.getURL ? browser.runtime.getURL("report.html") : null;
    const url = baseUrl ? new URL(baseUrl, window.location.href) : null;

    if (url && latestAnalysisTimestamp) {
      url.searchParams.set("timestamp", String(latestAnalysisTimestamp));
    }

    const finalUrl = url ? url.toString() : null;
    if (finalUrl) {
      openTab(finalUrl);
    } else {
      openTab(DASHBOARD_URL);
    }
  }

  function setupUploadDropzone() {
    if (!uploadDropzone) return;

    const preventDefaults = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadDropzone.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      uploadDropzone.addEventListener(
        eventName,
        () => {
          uploadDropzone.classList.add("is-dragover");
        },
        false,
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadDropzone.addEventListener(
        eventName,
        () => {
          uploadDropzone.classList.remove("is-dragover");
        },
        false,
      );
    });

    uploadDropzone.addEventListener(
      "drop",
      (event) => {
        const files = event.dataTransfer?.files;
        const file = files?.[0];
        if (file) {
          void handleUploadedFile(file);
        }
      },
      false,
    );

    const triggerUploadSelection = () => {
      if (!hasAccess) {
        setUploadStatus("Activate your plan to unlock file uploads.", "warning");
        setError("Activate your plan to upload and analyze documents.");
        return;
      }

      if (isFirefox) {
        openUploadWorkspace();
        return;
      }

      if (uploadFileInput && !uploadFileInput.disabled) {
        uploadFileInput.click();
      } else {
        setUploadStatus("Upload field unavailable. Reload and try again.", "error");
        setError("Upload field unavailable. Reload and try again.");
      }
    };

    uploadDropzone.addEventListener("click", triggerUploadSelection);

    uploadDropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        triggerUploadSelection();
      }
    });
  }

  function setBusy(message = "Analyzing...") {
    busy = true;
    statusBadge.textContent = "Working";
    statusBadge.className = "status-chip busy";
    statusMessage.textContent = message;
    refreshControls();
  }

  function setIdle(label = "Ready") {
    busy = false;
    statusBadge.textContent = label;
    statusBadge.className = "status-chip";
    refreshControls();
    refreshUploadStatusForAccess();
  }

  function setError(message) {
    busy = false;
    statusBadge.textContent = "Error";
    statusBadge.className = "status-chip error";
    statusMessage.textContent = message;
    refreshControls();
    refreshUploadStatusForAccess();
  }

  function updateRiskBadge(level = "info") {
    const normalized = (level || "info").toLowerCase();
    const supported = new Set(["info", "low", "medium", "high"]);
    const variant = supported.has(normalized) ? normalized : "info";
    riskLevelBadge.textContent = describeRisk(variant);
    riskLevelBadge.className = `risk-chip risk-${variant}`;
  }

  function describeIssueSeverity(weight = 0) {
    if (!Number.isFinite(weight)) return "Info";
    if (weight >= 8) return "High";
    if (weight >= 4) return "Medium";
    return "Low";
  }

  function formatIssueSnippet(snippet = "") {
    if (!snippet) return "";
    const normalized = snippet.replace(/\s+/g, " ").trim();
    if (!normalized) return "";
    if (normalized.length <= 140) {
      return normalized;
    }
    return `${normalized.slice(0, 137)}…`;
  }

  function formatSummaryText(summary = "", limit = 260) {
    const normalized = summary.replace(/\s+/g, " ").trim();
    if (!normalized) {
      return "Analysis complete. Review the findings below.";
    }
    if (normalized.length <= limit) {
      return normalized;
    }
    return `${normalized.slice(0, Math.max(0, limit - 1))}…`;
  }

  function renderHighlights(issues = []) {
    if (!highlightsSection || !highlightChipsEl) return;

    highlightChipsEl.innerHTML = "";

    if (!issues.length) {
      highlightsSection.classList.add("hidden");
      return;
    }

    const categoryScores = issues.reduce((acc, issue) => {
      const category = issue.category || "General";
      const weight = Number.isFinite(issue.weight) ? issue.weight : 1;
      acc[category] = (acc[category] || 0) + weight;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (!topCategories.length) {
      highlightsSection.classList.add("hidden");
      return;
    }

    topCategories.forEach(([category, score]) => {
      const chip = document.createElement("span");
      chip.className = "highlight-chip";
      const severity = describeIssueSeverity(score);
      chip.textContent = `${category} · ${severity}`;
      highlightChipsEl.appendChild(chip);
    });

    highlightsSection.classList.remove("hidden");
  }

  function updateIssues(issues = []) {
    if (!issuesListEl || !issuesCountEl) return;

    issuesListEl.querySelectorAll(".issues-item").forEach((node) => node.remove());
    const issueCountLabel = issues.length ? `${issues.length}` : "0";
    issuesCountEl.textContent = issueCountLabel;
    issuesCountEl.title = issues.length ? `${issues.length} flagged item${issues.length === 1 ? "" : "s"}` : "No issues flagged";

    renderHighlights(issues);

    if (!issues.length) {
      if (issuesEmptyEl) {
        issuesEmptyEl.classList.remove("hidden");
        if (!issuesEmptyEl.parentElement) {
          issuesListEl.appendChild(issuesEmptyEl);
        }
      }
      return;
    }

    if (issuesEmptyEl) {
      issuesEmptyEl.classList.add("hidden");
    }

    issues.forEach((issue, index) => {
      const li = document.createElement("li");
      li.className = "issues-item";

      const title = document.createElement("h4");
      title.textContent = `${index + 1}. ${issue.category || "Issue"}`;
      li.appendChild(title);

      if (issue.snippet) {
        const snippet = document.createElement("p");
        const severity = describeIssueSeverity(issue.weight);
        const snippetText = formatIssueSnippet(issue.snippet);
        const detail = snippetText ? `${severity} impact — ${snippetText}` : `${severity} impact`;
        snippet.textContent = detail;
        snippet.title = issue.snippet;
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

  function titleCase(value = "") {
    return value
      .toString()
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const PAID_PLAN_TIERS = new Set(["basic", "professional", "enterprise", "pay_per_document"]);

  function hasActiveAccess(subscription) {
    if (!subscription) return false;
    const { status, current_period_end: periodEnd, plan_type: planType } = subscription;
    const normalizedStatus = typeof status === "string" ? status.toLowerCase() : "";
    const normalizedPlanType = typeof planType === "string" ? planType.toLowerCase() : "";

    if (normalizedStatus === "trialing") {
      if (!periodEnd) return true;
      const end = new Date(periodEnd).getTime();
      return Number.isFinite(end) ? end > Date.now() : true;
    }

    if (normalizedStatus === "active") {
      if (!normalizedPlanType) return true;
      if (PAID_PLAN_TIERS.has(normalizedPlanType)) {
        return true;
      }
      return Array.from(PAID_PLAN_TIERS).some((tier) => normalizedPlanType.startsWith(tier));
    }

    return false;
  }

  function parseDocumentLimit(profile) {
    if (!profile) return null;
    const raw = profile.document_limit;
    if (typeof raw === "number") {
      return Number.isFinite(raw) ? raw : null;
    }
    if (typeof raw === "string" && raw.trim() !== "") {
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  function hasProfileAllowance(profile) {
    const limit = parseDocumentLimit(profile);
    return typeof limit === "number" && limit > 0;
  }

  function describeProfileAllowance(profile) {
    const limit = parseDocumentLimit(profile);
    if (limit === null || limit <= 0) return null;
    if (limit >= 999_999) return "Unlimited analyses";
    return `${formatCount(limit)} analyses available`;
  }

  function describeSubscription(subscription, { whenMissing = "Sign in required" } = {}) {
    if (!subscription) return whenMissing;
    const readablePlan = subscription.plan_type ? titleCase(subscription.plan_type) : "Subscription";
    const normalizedPlanType = subscription.plan_type?.toLowerCase?.() ?? "";
    const isPaidTier = normalizedPlanType ? PAID_PLAN_TIERS.has(normalizedPlanType) : false;

    if (subscription.status === "active") {
      return isPaidTier ? `${readablePlan} active` : "Plan inactive for extension";
    }
    if (subscription.status === "trialing") {
      const end = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
      const formatted = end ? end.toLocaleDateString([], { month: "short", day: "numeric" }) : null;
      return formatted ? `Trial active · ends ${formatted}` : "Trial active";
    }
    return `Status: ${titleCase(subscription.status)}`;
  }

  function computeStatusCopy() {
    if (!supabaseClient) {
      return "Connection unavailable. Reload the popup.";
    }
    if (!currentUser) {
      return "Sign in with your LegalDeep account to analyze text.";
    }
    if (!subscriptionFetched) {
      return "Syncing your subscription details...";
    }
    if (!hasAccess) {
      return "Extension access is limited to paid plans and active trials.";
    }
  const nameSource = (cachedProfile?.username || "").split(" ")[0] || (cachedProfile?.email || currentUser?.email || "");
  const normalized = nameSource.includes("@") ? nameSource.split("@")[0] : nameSource;
  const friendly = normalized.replace(/[._-]+/g, " ").trim();
  const greeting = friendly ? `Welcome back, ${titleCase(friendly)}.` : "";
    const prompt = "Highlight contract text to begin.";
    return greeting ? `${greeting} ${prompt}` : prompt;
  }

  function updateAccessUI() {
    renderAccountCard();

    toggleElement(authPanel, !currentUser);
    toggleElement(subscriptionWarning, Boolean(currentUser) && subscriptionFetched && !hasAccess);

    if (bodyEl) {
      const state = !currentUser ? "signedOut" : hasAccess ? "granted" : "locked";
      bodyEl.dataset.accessState = state;
      updateGatedOverlays(state);
    }

    if (planBadge) {
      const subscription = currentSubscription || cachedProfile?.subscription || null;
      const allowanceDescription = describeProfileAllowance(cachedProfile);
      const whenMissing = currentUser ? "No active plan" : "Sign in required";
      const label = subscription
        ? describeSubscription(subscription, { whenMissing })
        : allowanceDescription || whenMissing;
      planBadge.textContent = label;
      const variant = hasAccess
        ? "success"
        : subscription
          ? "warning"
          : allowanceDescription
            ? "success"
            : "idle";
      setPlanPillState(planBadge, variant);
    }

    if (!busy && statusBadge && statusMessage) {
      statusMessage.textContent = computeStatusCopy();
      const statusLabel = hasAccess
        ? "Ready"
        : currentUser
          ? subscriptionFetched
            ? "Locked"
            : "Syncing"
          : "Sign in";
      statusBadge.textContent = statusLabel;
      statusBadge.className = "status-chip";
      if (hasAccess) {
        statusBadge.classList.add("success");
      } else if (currentUser && !subscriptionFetched) {
        statusBadge.classList.add("busy");
      } else if (currentUser) {
        statusBadge.classList.add("warning");
      } else {
        statusBadge.classList.add("idle");
      }
    }

    refreshUploadStatusForAccess();
    refreshControls();
  }

  function updateGatedOverlays(state) {
    if (!gatedSections.length) return;

    gatedSections.forEach((element) => {
      const signedOutMessage = element.dataset.signedoutLabel || "Sign in to unlock";
      const lockedMessage = element.dataset.planLockedLabel || signedOutMessage;
      const activeMessage = element.dataset.activeLabel || "";

      let message = activeMessage;
      if (state === "signedOut") {
        message = signedOutMessage;
      } else if (state === "locked") {
        message = lockedMessage;
      }

      element.dataset.gateState = state;
      element.dataset.gateLabel = message;
    });
  }

  async function loadLastAnalysis() {
    const data = await objectStorage.get(STORAGE_KEY);
    if (!data) return;
    await applyAnalysisResult(data, { persistRecent: true });
  }

  function renderAnalysis(data) {
    const formattedSummary = formatSummaryText(data.summary || "");
    const summaryNote = data.truncated
      ? " Popup preview capped at 60k characters—open the dashboard for the full report."
      : "";
    const combinedSummary = `${formattedSummary}${summaryNote}`.trim();
    summaryEl.textContent = combinedSummary;
    summaryEl.title = combinedSummary;

    const baseSource = describeSource(data.source);
    const sourceLabel = data.source === "upload" && data.fileKind ? `${baseSource} · ${data.fileKind}` : baseSource;
    sourceEl.textContent = sourceLabel;
    sourceEl.title = sourceLabel;

    scoreEl.textContent = formatCount(Math.round(data.score ?? 0));

    const resolvedWordCount = Number.isFinite(data.wordCount)
      ? data.wordCount
      : Math.round((data.characterCount || 0) / 5);
    const wordLabel = data.truncated ? `${formatCount(resolvedWordCount)}+` : formatCount(resolvedWordCount);
    wordsEl.textContent = wordLabel;
    wordsEl.title = data.truncated
      ? "Approximate word count shown. Open the dashboard to analyze the full document."
      : `${formatCount(resolvedWordCount)} words`;
    updatedEl.textContent = formatTime(data.timestamp);

    if (data.truncated) {
      statusMessage.textContent = "Popup preview trimmed to keep things fast. Open the dashboard for the full document.";
    } else if (data.source === "page") {
      statusMessage.textContent = "Page scan complete—scroll for the highlighted clauses.";
    } else if (data.source === "selection") {
      statusMessage.textContent = "Selection analyzed—your highlight stays on the page.";
    } else if (data.source === "upload") {
      const name = data.fileName ? `"${data.fileName}"` : "your file";
      statusMessage.textContent = `Analyzed ${name}. Review the quick takeaways below.`;
    } else {
      statusMessage.textContent = "Custom text analyzed—summary updated below.";
    }

    updateRiskBadge(data.level || "info");
    updateIssues(data.issues || []);
    setIdle("Ready");
  }

  async function triggerContentAnalysis(mode, text = "") {
    if (!hasAccess) {
      setError("Sign in with an active plan to run the analyzer.");
      return;
    }

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
    if (!hasAccess) {
      setError("Active subscription required before analyzing text.");
      return;
    }

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

    await applyAnalysisResult(payload);
  }

  async function handleUploadedFile(file) {
    if (!hasAccess) {
      setUploadStatus("Activate your plan to unlock file uploads.", "warning");
      setError("Activate your plan to upload and analyze documents.");
      return;
    }

    if (!file) {
      return;
    }

    if (!uploadToolkit?.prepareFileForAnalysis) {
      setUploadStatus("Upload helper unavailable. Reload this popup and try again.", "error");
      setError("Upload helper unavailable. Reload and try again.");
      return;
    }

    const nameLabel = file.name ? `"${file.name}"` : "your file";
    setUploadStatus(`Preparing ${nameLabel}...`, "busy");

    const preparation = await uploadToolkit.prepareFileForAnalysis(file);
    if (!preparation.ok) {
      setUploadStatus(preparation.message || "Unable to process that file.", "error");
      setError(preparation.message || "Unable to process that file in the popup.");
      return;
    }

    const { truncatedText, truncated, originalLength, kindLabel } = preparation;
    const readableKind = kindLabel || "Document";

    const analyzer = window.LegalDeepRisk;
    if (!analyzer?.analyzeText) {
      setUploadStatus("Analysis engine unavailable. Reload and try again.", "error");
      setError("Analysis engine unavailable in popup. Reload and try again.");
      return;
    }

    setBusy(`Analyzing ${readableKind.toLowerCase()}...`);

    try {
      const result = analyzer.analyzeText(truncatedText);
      const summaryFromAnalyzer = typeof result.summary === "string" ? result.summary.trim() : "";
      const payload = {
        ...result,
        summary: summaryFromAnalyzer || (file.name ? `Analysis for ${file.name}` : "Uploaded document analysis"),
        source: "upload",
        timestamp: Date.now(),
        sample: truncatedText.slice(0, 500),
        characterCount: originalLength,
        truncated,
        fileName: file.name || null,
        fileKind: readableKind,
      };
      await applyAnalysisResult(payload);
      const completionMessage = truncated
        ? `${readableKind} analyzed. Popup preview trimmed—open the dashboard for the full report.`
        : `${readableKind} analyzed. Scroll down for insights.`;
      setUploadStatus(completionMessage, truncated ? "warning" : "success");
    } catch (error) {
      console.error("Failed to analyze uploaded file", error);
      setUploadStatus("Unable to analyze that file. Try again or use the dashboard.", "error");
      setError("Unable to analyze that file in the popup. Try again or use the dashboard.");
    }
  }

  async function fetchSubscription(userId) {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from("subscriptions")
      .select("status,plan_type,current_period_end,current_period_start,cancel_at")
      .eq("user_id", userId)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Subscription lookup failed", error);
      throw error;
    }

    return data || null;
  }

  async function fetchProfile(user) {
    if (!supabaseClient || !user?.id) return null;

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("email,username,document_limit,last_login,updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Profile lookup failed", error);
      throw error;
    }

    const resolvedEmail = data?.email || user.email || cachedProfile?.email || "";

    return {
      userId: user.id,
      email: resolvedEmail,
      username: data?.username || "",
      document_limit: data?.document_limit ?? null,
      last_login: data?.last_login || null,
      updated_at: data?.updated_at || null,
    };
  }

  async function handleSession(session) {
    currentUser = session?.user ?? null;
    currentSubscription = null;
    hasAccess = false;
    subscriptionFetched = false;

    if (!currentUser) {
      await clearCachedAnalysis();
      await clearProfileCache();
      updateAccessUI();
      return;
    }

    await loadCachedProfile(currentUser.id);
    updateAccessUI();

    let fetchedProfile = null;
    let fetchedSubscription = null;

    const [profileResult, subscriptionResult] = await Promise.allSettled([
      fetchProfile(currentUser),
      fetchSubscription(currentUser.id),
    ]);

    if (profileResult.status === "fulfilled") {
      fetchedProfile = profileResult.value;
    } else if (profileResult.reason) {
      console.error("Profile sync failed", profileResult.reason);
    }

    if (subscriptionResult.status === "fulfilled") {
      fetchedSubscription = subscriptionResult.value;
      setAuthError("");
    } else {
      console.error("Subscription sync failed", subscriptionResult.reason);
      fetchedSubscription = cachedProfile?.subscription || null;
      if (!hasActiveAccess(fetchedSubscription)) {
        setAuthError("Unable to verify subscription. Retrying shortly.");
      } else {
        setAuthError("");
      }
    }

    subscriptionFetched = true;

    const resolvedSubscription = fetchedSubscription || cachedProfile?.subscription || null;
    currentSubscription = resolvedSubscription;
    const subscriptionSnapshot = resolvedSubscription
      ? {
          status: resolvedSubscription.status,
          plan_type: resolvedSubscription.plan_type,
          current_period_end: resolvedSubscription.current_period_end,
          current_period_start: resolvedSubscription.current_period_start,
          cancel_at: resolvedSubscription.cancel_at,
        }
      : cachedProfile?.subscription || null;

    if (fetchedProfile || subscriptionSnapshot) {
      await persistProfile({
        ...(fetchedProfile || {
          userId: currentUser.id,
          email: currentUser.email || cachedProfile?.email || "",
        }),
        subscription: subscriptionSnapshot,
        fetchedAt: Date.now(),
      });
    }

    const subscriptionForAccess = currentSubscription || cachedProfile?.subscription || null;
    hasAccess = hasActiveAccess(subscriptionForAccess) || hasProfileAllowance(cachedProfile);
    if (!hasAccess) {
      await clearCachedAnalysis();
    }
    updateAccessUI();
  }

  async function initializeSupabase() {
    if (!window.supabase) {
      console.error("Supabase client unavailable in extension context");
      if (planBadge) planBadge.textContent = "Offline";
      if (statusMessage) statusMessage.textContent = "Unable to reach LegalDeep auth services.";
      refreshControls();
      return;
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: supabaseStorage,
        storageKey: AUTH_STORAGE_KEY,
      },
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Error retrieving session", error);
      setAuthError("Unable to verify session. Please sign in.");
      handleSession(null);
      return;
    }

    await handleSession(data.session);
  }

  function openTab(url) {
    if (!url) return;
    try {
      if (typeof browser !== "undefined" && browser?.tabs?.create) {
        browser.tabs.create({ url }).catch(() => window.open(url, "_blank"));
        return;
      }
      window.open(url, "_blank");
    } catch (error) {
      window.open(url, "_blank");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!supabaseClient) {
        setAuthError("Authentication service unavailable.");
        return;
      }

      const email = (loginEmailInput?.value || "").trim().toLowerCase();
      const password = loginPasswordInput?.value || "";

      if (!email || !password) {
        setAuthError("Enter your email and password.");
        return;
      }

      setAuthError("");
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";
      }

      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = "Sign in";
      }

      if (error) {
        setAuthError(error.message || "Sign in failed. Check your credentials.");
        return;
      }

      setAuthError("");
      if (statusMessage) {
        statusMessage.textContent = "Signed in successfully. Checking subscription...";
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
      await clearCachedAnalysis();
      await clearProfileCache();
      setAuthError("");
      if (statusMessage) {
        statusMessage.textContent = "Signed out. Sign in again to resume analysis.";
      }
    });
  }

  if (openDashboardBtn) {
    openDashboardBtn.addEventListener("click", () => openTab(DASHBOARD_URL));
  }

  if (manageAccountBtn) {
    manageAccountBtn.addEventListener("click", () => openTab(DASHBOARD_URL));
  }

  if (openReportBtn) {
    openReportBtn.addEventListener("click", openReportView);
  }

  if (manageBillingBtn) {
    manageBillingBtn.addEventListener("click", () => openTab(BILLING_URL));
  }

  if (uploadFileBtn) {
    uploadFileBtn.addEventListener("click", () => {
      if (!hasAccess) {
        setUploadStatus("Activate your plan to unlock file uploads.", "warning");
        setError("Activate your plan to upload and analyze documents.");
        return;
      }

      if (isFirefox) {
        openUploadWorkspace();
        return;
      }

      if (uploadFileInput) {
        uploadFileInput.click();
      } else {
        setUploadStatus("Upload field unavailable. Reload and try again.", "error");
        setError("Upload field unavailable. Reload and try again.");
      }
    });
  }

  if (uploadFileInput) {
    uploadFileInput.addEventListener("change", async (event) => {
      if (isFirefox) {
        uploadFileInput.value = "";
        return;
      }
      const file = event?.target?.files?.[0];
      try {
        await handleUploadedFile(file);
      } finally {
        uploadFileInput.value = "";
      }
    });
  }

  if (viewPricingBtn) {
    viewPricingBtn.addEventListener("click", () => openTab(PRICING_URL));
  }

  if (subscriptionHelpBtn) {
    subscriptionHelpBtn.addEventListener("click", () => openTab(SUPPORT_URL));
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== "LEGALDEEP_ANALYSIS_READY") return;
    setUploadStatus("Upload complete. Scroll down for highlights or open the dashboard for the full report.", "success");
    setIdle("Ready");
    void loadLastAnalysis();
  });

  analyzeSelectionBtn.addEventListener("click", () => triggerContentAnalysis("selection"));
  analyzePageBtn.addEventListener("click", () => triggerContentAnalysis("page"));
  analyzeCustomBtn.addEventListener("click", analyzeCustomText);

  setupUploadDropzone();
  refreshUploadStatusForAccess();
  updateReportButtonVisibility(false);
  updateReportButtonDisabledState();
  void initializeSupabase();
  void loadRecentAnalysesFromStorage();
  void loadUsageCounters();
  void loadLastAnalysis();

  window.addEventListener("unload", () => {
    void clearCachedAnalysis();
  });
})();
