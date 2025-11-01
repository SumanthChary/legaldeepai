(() => {
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const SUPABASE_URL = "https://nhmhqhhxlcmhufxxifbn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obWhxaGh4bGNtaHVmeHhpZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODYxMjYsImV4cCI6MjA1MzQ2MjEyNn0.IHb10FPooqBbe06KiR8eSHRlpkJmJtj_4iahFpRDu7M";
  const DASHBOARD_URL = "https://legaldeep.ai/dashboard";
  const BILLING_URL = "https://legaldeep.ai/payment";
  const PROFILE_STORAGE_KEY = "legaldeepProfile";
  const AUTH_STORAGE_KEY = "legaldeepAuthState";
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
  const planBadge = document.getElementById("plan-badge");
  const accountCard = document.getElementById("account-card");
  const accountEmail = document.getElementById("account-email");
  const accountPlan = document.getElementById("account-plan");
  const accountUpdated = document.getElementById("account-updated");
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

  let supabaseClient = null;
  let currentUser = null;
  let currentSubscription = null;
  let hasAccess = false;
  let cachedProfile = null;
  let subscriptionFetched = false;
  let busy = false;

  async function clearCachedAnalysis() {
    try {
      await objectStorage.remove(STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear cached analysis", error);
    }
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
    element.className = "plan-pill";
    if (variant) {
      element.classList.add(variant);
    }
  }

  function renderAccountCard() {
    const shouldShow = Boolean(currentUser);
    toggleElement(accountCard, shouldShow);

    if (!shouldShow) return;

    const subscription = currentSubscription || cachedProfile?.subscription || null;
    const variant = hasActiveAccess(subscription)
      ? "success"
      : subscription
        ? "warning"
        : "idle";

    if (accountEmail) {
      accountEmail.textContent = cachedProfile?.email || currentUser?.email || "—";
    }

    if (accountPlan) {
      accountPlan.textContent = describeSubscription(subscription, { whenMissing: "No active plan" });
      setPlanPillState(accountPlan, variant);
    }

    if (accountUpdated) {
      const timestamp = cachedProfile?.fetchedAt || cachedProfile?.updated_at || null;
      accountUpdated.textContent = timestamp ? formatRelativeTimestamp(timestamp) : "—";
    }
  }

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

  function describeSubscription(subscription, { whenMissing = "Sign in required" } = {}) {
    if (!subscription) return whenMissing;
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
    if (!subscriptionFetched) {
      return "Syncing your subscription details...";
    }
    if (!hasAccess) {
      return "Active subscription or trial required. Manage billing from the dashboard.";
    }
  const nameSource = (cachedProfile?.username || "").split(" ")[0] || (cachedProfile?.email || currentUser?.email || "");
  const normalized = nameSource.includes("@") ? nameSource.split("@")[0] : nameSource;
  const friendly = normalized.replace(/[._-]+/g, " ").trim();
  const greeting = friendly ? `Welcome back, ${titleCase(friendly)}.` : "";
    return `${greeting ? `${greeting} ` : ""}Highlight contract text to begin.`.trim();
  }

  function updateAccessUI() {
    renderAccountCard();

    toggleElement(authPanel, !currentUser);
    toggleElement(subscriptionWarning, Boolean(currentUser) && subscriptionFetched && !hasAccess);

    if (planBadge) {
      const subscription = currentSubscription || cachedProfile?.subscription || null;
      const whenMissing = currentUser ? "No active plan" : "Sign in required";
      planBadge.textContent = describeSubscription(subscription, { whenMissing });
      planBadge.className = "plan-badge";
      if (hasActiveAccess(subscription)) {
        planBadge.classList.add("success");
      } else if (subscription) {
        planBadge.classList.add("warning");
      } else {
        planBadge.classList.add("idle");
      }
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
      statusBadge.className = currentUser && !subscriptionFetched ? "status-badge busy" : "status-badge idle";
    }

    refreshControls();
  }

  async function loadLastAnalysis() {
    const data = await objectStorage.get(STORAGE_KEY);
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

    await objectStorage.set(STORAGE_KEY, payload);
    renderAnalysis(payload);
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

    currentSubscription = fetchedSubscription || null;
    const subscriptionSnapshot = currentSubscription
      ? {
          status: currentSubscription.status,
          plan_type: currentSubscription.plan_type,
          current_period_end: currentSubscription.current_period_end,
          current_period_start: currentSubscription.current_period_start,
          cancel_at: currentSubscription.cancel_at,
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

    hasAccess = hasActiveAccess(currentSubscription);
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

  if (manageBillingBtn) {
    manageBillingBtn.addEventListener("click", () => openTab(BILLING_URL));
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.type !== "LEGALDEEP_ANALYSIS_READY") return;
    void loadLastAnalysis();
  });

  analyzeSelectionBtn.addEventListener("click", () => triggerContentAnalysis("selection"));
  analyzePageBtn.addEventListener("click", () => triggerContentAnalysis("page"));
  analyzeCustomBtn.addEventListener("click", analyzeCustomText);

  void initializeSupabase();
  void loadLastAnalysis();

  window.addEventListener("unload", () => {
    void clearCachedAnalysis();
  });
})();
