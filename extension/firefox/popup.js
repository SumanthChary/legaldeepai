(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const SUPABASE_URL = "https://nhmhqhhxlcmhufxxifbn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obWhxaGh4bGNtaHVmeHhpZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODYxMjYsImV4cCI6MjA1MzQ2MjEyNn0.IHb10FPooqBbe06KiR8eSHRlpkJmJtj_4iahFpRDu7M";
  const DASHBOARD_URL = "https://legaldeep.ai/dashboard";
  const BILLING_URL = "https://legaldeep.ai/payment";

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
  const planBadge = document.getElementById("plan-badge");
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

  let supabaseClient = null;
  let currentUser = null;
  let currentSubscription = null;
  let hasAccess = false;
  let busy = false;

  function setAuthError(message = "") {
    if (authError) {
      authError.textContent = message;
    }
  }

  function toggleElement(element, show) {
    if (!element) return;
    element.classList.toggle("hidden", !show);
  }

  function refreshControls() {
    const disabled = !hasAccess || busy;
    if (analyzeSelectionBtn) analyzeSelectionBtn.disabled = disabled;
    if (analyzePageBtn) analyzePageBtn.disabled = disabled;
    if (analyzeCustomBtn) analyzeCustomBtn.disabled = disabled;
    if (logoutButton) logoutButton.disabled = !currentUser;
  }

  function setBusy(message = "Analyzing...") {
    busy = true;
    statusBadge.textContent = "Working";
    statusBadge.className = "status-badge busy";
    statusMessage.textContent = message;
    refreshControls();
  }

  function setIdle(label = "Ready") {
    busy = false;
    statusBadge.textContent = label;
    statusBadge.className = "status-badge idle";
    refreshControls();
  }

  function setError(message) {
    busy = false;
    statusBadge.textContent = "Error";
    statusBadge.className = "status-badge error";
    statusMessage.textContent = message;
    refreshControls();
  }

  function updateRiskBadge(level = "info") {
    const normalized = (level || "info").toLowerCase();
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

  function titleCase(value = "") {
    return value
      .toString()
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function hasActiveAccess(subscription) {
    if (!subscription) return false;
    const { status, current_period_end: periodEnd } = subscription;
    if (status === "active") return true;
    if (status === "trialing") {
      if (!periodEnd) return true;
      const end = new Date(periodEnd).getTime();
      return Number.isFinite(end) ? end > Date.now() : true;
    }
    return false;
  }

  function describeSubscription(subscription) {
    if (!subscription) return "Sign in required";
    const readablePlan = subscription.plan_type ? titleCase(subscription.plan_type) : "Subscription";
    if (subscription.status === "active") {
      return `${readablePlan} active`;
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
    if (!hasAccess) {
      return "Active subscription or trial required. Manage billing from the dashboard.";
    }
    return "Highlight contract text to begin.";
  }

  function updateAccessUI() {
    toggleElement(authPanel, !currentUser);
    toggleElement(subscriptionWarning, Boolean(currentUser) && !hasAccess);

    if (planBadge) {
      planBadge.textContent = describeSubscription(currentSubscription) || "Sign in required";
    }

    if (!busy && statusBadge && statusMessage) {
      statusMessage.textContent = computeStatusCopy();
      statusBadge.textContent = hasAccess ? "Ready" : currentUser ? "Locked" : "Sign in";
      statusBadge.className = "status-badge idle";
    }

    refreshControls();
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

    await browser.storage.local.set({ [STORAGE_KEY]: payload });
    renderAnalysis(payload);
  }

  async function fetchSubscription(userId) {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from("subscriptions")
      .select("status,plan_type,current_period_end")
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

  async function handleSession(session) {
    currentUser = session?.user ?? null;
    currentSubscription = null;
    hasAccess = false;

    if (!currentUser) {
      updateAccessUI();
      return;
    }

    try {
      currentSubscription = await fetchSubscription(currentUser.id);
    } catch (error) {
      console.error("Subscription verification failed", error);
      setAuthError("Unable to verify subscription. Try again shortly.");
    }

    hasAccess = hasActiveAccess(currentSubscription);
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
        storage: window.localStorage,
      },
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
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
      setAuthError("");
      if (statusMessage) {
        statusMessage.textContent = "Signed out. Sign in again to resume analysis.";
      }
    });
  }

  if (openDashboardBtn) {
    openDashboardBtn.addEventListener("click", () => openTab(DASHBOARD_URL));
  }

  if (manageBillingBtn) {
    manageBillingBtn.addEventListener("click", () => openTab(BILLING_URL));
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== "LEGALDEEP_ANALYSIS_READY") return;
    loadLastAnalysis();
  });

  analyzeSelectionBtn.addEventListener("click", () => triggerContentAnalysis("selection"));
  analyzePageBtn.addEventListener("click", () => triggerContentAnalysis("page"));
  analyzeCustomBtn.addEventListener("click", analyzeCustomText);

  initializeSupabase();
  loadLastAnalysis();
})();
