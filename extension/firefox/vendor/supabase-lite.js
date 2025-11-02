(function () {
  const REFRESH_MARGIN_SECONDS = 60;

  const noopStorage = {
    async getItem() {
      return null;
    },
    async setItem() {
      return undefined;
    },
    async removeItem() {
      return undefined;
    },
  };

  function cloneSession(session) {
    return session ? JSON.parse(JSON.stringify(session)) : null;
  }

  function parseStoredSession(raw) {
    if (!raw) return null;
    try {
      const value = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (value && typeof value === "object" && value.session) {
        return value.session;
      }
    } catch (error) {
      console.warn("Unable to parse stored Supabase session", error);
    }
    return null;
  }

  async function readResponseBody(response) {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (_error) {
      return text;
    }
  }

  function buildError(response, payload, fallbackMessage) {
    const message = payload && typeof payload === "object" && payload.message
      ? payload.message
      : fallbackMessage;
    const code = payload && typeof payload === "object" && payload.code
      ? payload.code
      : String(response.status);
    return {
      message: message || "Request failed",
      code,
      status: response.status,
      details: payload && typeof payload === "object" ? payload.hint || payload.details || null : null,
    };
  }

  class SupabaseQueryBuilder {
    constructor(client, table) {
      this.client = client;
      this.table = table;
      this.columns = "*";
      this.filters = [];
      this.orderings = [];
      this.single = false;
      this.allowEmpty = false;
      this.limitValue = null;
    }

    select(columns) {
      if (columns) {
        this.columns = columns;
      }
      return this;
    }

    eq(column, value) {
      this.filters.push({ type: "eq", column, value });
      return this;
    }

    order(column, { ascending = true } = {}) {
      this.orderings.push({ column, ascending });
      return this;
    }

    limit(value) {
      this.limitValue = Number.isFinite(value) ? Number(value) : null;
      return this;
    }

    maybeSingle() {
      this.single = true;
      this.allowEmpty = true;
      return this.execute();
    }

    async execute() {
      const session = await this.client.ensureSession();
      if (!session) {
        return {
          data: null,
          error: {
            message: "Not authenticated",
            code: "AUTH-401",
            status: 401,
            details: null,
          },
        };
      }

      const url = new URL(`${this.client.restUrl}/${encodeURIComponent(this.table)}`);
      url.searchParams.set("select", this.columns || "*");

      this.filters.forEach((filter) => {
        if (filter.type === "eq") {
          url.searchParams.append(filter.column, `eq.${filter.value}`);
        }
      });

      this.orderings.forEach((ordering) => {
        const direction = ordering.ascending ? "asc" : "desc";
        url.searchParams.append("order", `${ordering.column}.${direction}`);
      });

      if (this.limitValue != null) {
        url.searchParams.set("limit", String(this.limitValue));
      }

      const headers = {
        apikey: this.client.key,
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      };

      const response = await this.client.fetchImpl(url.toString(), {
        method: "GET",
        headers,
      });

      const payload = await readResponseBody(response);
      if (!response.ok) {
        return { data: null, error: buildError(response, payload) };
      }

      if (!this.single) {
        return { data: payload, error: null };
      }

      if (Array.isArray(payload)) {
        if (payload.length === 0) {
          return {
            data: null,
            error: {
              message: "No rows found",
              code: "PGRST116",
              status: response.status,
              details: null,
            },
          };
        }
        return { data: payload[0], error: null };
      }

      if (payload && typeof payload === "object") {
        return { data: payload, error: null };
      }

      if (this.allowEmpty) {
        return {
          data: null,
          error: {
            message: "No rows found",
            code: "PGRST116",
            status: response.status,
            details: null,
          },
        };
      }

      return {
        data: null,
        error: {
          message: "Unexpected response format",
          code: "PGRST000",
          status: response.status,
          details: null,
        },
      };
    }
  }

  class SupabaseLiteClient {
    constructor(url, key, options = {}) {
      this.baseUrl = (url || "").replace(/\/$/, "");
      this.authUrl = `${this.baseUrl}/auth/v1`;
      this.restUrl = `${this.baseUrl}/rest/v1`;
      this.key = key;
      this.session = null;
      this.refreshTimer = null;

      const authOptions = options.auth || {};
      this.storage = authOptions.storage || noopStorage;
      this.storageKey = authOptions.storageKey || "supabase-auth-token";
      this.persistSession = authOptions.persistSession !== false;
      this.autoRefreshToken = authOptions.autoRefreshToken !== false;

      this.fetchImpl = (options.global && typeof options.global.fetch === "function")
        ? options.global.fetch.bind(options.global)
        : typeof fetch === "function"
          ? fetch.bind(globalThis)
          : null;

      if (!this.fetchImpl) {
        throw new Error("No fetch implementation available for Supabase client");
      }

      this.listeners = new Set();
    }

    from(table) {
      return new SupabaseQueryBuilder(this, table);
    }

    get auth() {
      return {
        onAuthStateChange: (callback) => this.onAuthStateChange(callback),
        getSession: () => this.getSession(),
        signInWithPassword: (payload) => this.signInWithPassword(payload),
        signOut: () => this.signOut(),
      };
    }

    async ensureSession() {
      if (this.session) {
        return this.session;
      }

      if (!this.persistSession) {
        return null;
      }

      const raw = await this.storage.getItem(this.storageKey);
      const stored = parseStoredSession(raw);
      if (stored) {
        this.session = stored;
        this.scheduleRefresh(stored);
      }
      return this.session;
    }

    async getSession() {
      const session = await this.ensureSession();
      return { data: { session: cloneSession(session) }, error: null };
    }

    onAuthStateChange(callback) {
      if (typeof callback === "function") {
        this.listeners.add(callback);
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.listeners.delete(callback);
            },
          },
        },
        error: null,
      };
    }

    async signInWithPassword({ email, password }) {
      try {
        const response = await this.fetchImpl(`${this.authUrl}/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: this.key,
            Authorization: `Bearer ${this.key}`,
          },
          body: JSON.stringify({ email, password }),
        });

        const payload = await readResponseBody(response);
        if (!response.ok) {
          return { data: null, error: buildError(response, payload, "Sign in failed") };
        }

        const session = this.normalizeSession(payload);
        await this.persistSession(session);
        this.handleSession("SIGNED_IN", session);
        return { data: { session: cloneSession(session) }, error: null };
      } catch (error) {
        return {
          data: null,
          error: {
            message: error?.message || "Sign in failed",
            code: "AUTH_NETWORK_ERROR",
            status: 0,
            details: null,
          },
        };
      }
    }

    async signOut() {
      const session = await this.ensureSession();
      if (session?.access_token) {
        try {
          await this.fetchImpl(`${this.authUrl}/logout`, {
            method: "POST",
            headers: {
              apikey: this.key,
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        } catch (error) {
          console.warn("Supabase sign out request failed", error);
        }
      }

      await this.persistSession(null);
      this.handleSession("SIGNED_OUT", null);
      return { error: null };
    }

    async refreshSession() {
      const current = await this.ensureSession();
      if (!current?.refresh_token) {
        return;
      }

      try {
        const response = await this.fetchImpl(`${this.authUrl}/token?grant_type=refresh_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: this.key,
            Authorization: `Bearer ${this.key}`,
          },
          body: JSON.stringify({ refresh_token: current.refresh_token }),
        });

        const payload = await readResponseBody(response);
        if (!response.ok) {
          console.warn("Supabase token refresh failed", payload);
          await this.persistSession(null);
          this.handleSession("SIGNED_OUT", null);
          return;
        }

        const session = this.normalizeSession(payload);
        await this.persistSession(session);
        this.handleSession("TOKEN_REFRESHED", session);
      } catch (error) {
        console.warn("Supabase token refresh error", error);
        await this.persistSession(null);
        this.handleSession("SIGNED_OUT", null);
      }
    }

    normalizeSession(payload) {
      const session = {
        ...payload,
      };
      if (!session.expires_at) {
        const expiresIn = typeof session.expires_in === "number" ? session.expires_in : 3600;
        session.expires_at = Math.floor(Date.now() / 1000) + expiresIn;
      }
      return session;
    }

    async persistSession(session) {
      if (!this.persistSession) {
        this.session = session;
        this.scheduleRefresh(session);
        return;
      }

      if (!session) {
        this.session = null;
        this.clearRefresh();
        try {
          await this.storage.removeItem(this.storageKey);
        } catch (error) {
          console.warn("Unable to clear Supabase session", error);
        }
        return;
      }

      this.session = session;
      this.scheduleRefresh(session);
      try {
        const payload = JSON.stringify({ session });
        await this.storage.setItem(this.storageKey, payload);
      } catch (error) {
        console.warn("Unable to persist Supabase session", error);
      }
    }

    scheduleRefresh(session) {
      this.clearRefresh();
      if (!this.autoRefreshToken || !session?.expires_at || !session?.refresh_token) {
        return;
      }

      const expiresAtMs = session.expires_at * 1000;
      const timeoutMs = Math.max(expiresAtMs - Date.now() - REFRESH_MARGIN_SECONDS * 1000, 1000);
      if (!Number.isFinite(timeoutMs)) {
        return;
      }

      this.refreshTimer = setTimeout(() => {
        this.refreshSession().catch((error) => {
          console.warn("Supabase auto refresh failed", error);
        });
      }, timeoutMs);
    }

    clearRefresh() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    }

    handleSession(event, session) {
      if (session) {
        this.session = session;
      } else {
        this.session = null;
        this.clearRefresh();
      }

      const copy = cloneSession(this.session);
      this.listeners.forEach((callback) => {
        try {
          callback(event, copy);
        } catch (error) {
          console.warn("Supabase auth listener failed", error);
        }
      });
    }
  }

  function createClient(url, key, options) {
    return new SupabaseLiteClient(url, key, options || {});
  }

  if (!globalThis.supabase) {
    globalThis.supabase = { createClient };
  } else {
    globalThis.supabase.createClient = createClient;
  }
})();
