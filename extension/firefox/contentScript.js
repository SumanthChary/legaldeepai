(() => {
  const HIGHLIGHT_CLASS = "legaldeep-risk-highlight";
  const STORAGE_KEY = "legaldeepLastAnalysis";
  const MAX_ANALYSIS_LENGTH = 50000;

  function injectStyles() {
    if (document.getElementById("legaldeep-risk-style")) return;
    const style = document.createElement("style");
    style.id = "legaldeep-risk-style";
    style.textContent = `
      .${HIGHLIGHT_CLASS} {
        background: rgba(147, 51, 234, 0.2);
        outline: 2px solid rgba(79, 70, 229, 0.55);
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
        transition: background 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  function clearHighlights() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((node) => {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
      parent.normalize();
    });
  }

  function getSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!range || range.collapsed) return null;
    return range;
  }

  function highlightRange(range) {
    if (!range) return;
    if (typeof range.canSurroundContents === "function" && !range.canSurroundContents()) {
      return;
    }
    const wrapper = document.createElement("mark");
    wrapper.className = HIGHLIGHT_CLASS;
    try {
      range.surroundContents(wrapper);
    } catch (error) {
      console.warn("Unable to highlight selection", error);
    }
  }

  async function storeResult(payload) {
    await browser.storage.local.set({ [STORAGE_KEY]: payload });
    await browser.runtime.sendMessage({ type: "LEGALDEEP_ANALYSIS_READY" });
  }

  async function analyzeRequest({ selectionText = "", mode = "selection" } = {}) {
    injectStyles();
    clearHighlights();

    let text = "";
    let highlighted = false;

    if (mode === "page") {
      text = (document.body?.innerText || "").trim();
    } else {
      text = (selectionText || "").trim();
      if (!text) {
        const selection = window.getSelection();
        if (selection) {
          text = selection.toString().trim();
        }
      }

      const selectionRange = getSelection();
      if (selectionRange) {
        const rangeClone = selectionRange.cloneRange();
        highlightRange(rangeClone);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
        highlighted = true;
      }
    }

    if (!text) {
      await storeResult({
        summary: mode === "page"
          ? "Page contains no readable text to analyze."
          : "No text selected. Highlight contract language to analyze.",
        level: "info",
        score: 0,
        issues: [],
        wordCount: 0,
        source: mode,
        timestamp: Date.now(),
        sample: "",
        highlighted,
      });
      return;
    }

    const truncated = text.length > MAX_ANALYSIS_LENGTH;
    const textForAnalysis = truncated ? text.slice(0, MAX_ANALYSIS_LENGTH) : text;

    const analyzer = window.LegalDeepRisk;
    const result = analyzer?.analyzeText ? analyzer.analyzeText(textForAnalysis) : null;

    const payload = result || {
      summary: "Analysis engine unavailable.",
      level: "info",
      score: 0,
      issues: [],
      wordCount: textForAnalysis.split(/\s+/).filter(Boolean).length,
    };

    Object.assign(payload, {
      timestamp: Date.now(),
      sample: textForAnalysis.slice(0, 500),
      source: mode,
      highlighted,
      truncated,
      characterCount: textForAnalysis.length,
    });

    await storeResult(payload);
  }

  browser.runtime.onMessage.addListener((message) => {
    if (!message || message.type !== "LEGALDEEP_ANALYZE_SELECTION") return;
    analyzeRequest({
      selectionText: message.selectionText,
      mode: message.mode || "selection",
    });
  });
})();
