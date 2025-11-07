(function () {
  const MAX_UPLOAD_BYTES = 750 * 1024;
  const MAX_UPLOAD_CHARACTERS = 50_000;
  const SUPPORTED_TEXT_TYPES = new Set([
    "text/plain",
    "text/markdown",
    "application/json",
    "text/csv",
    "text/html",
  ]);
  const SUPPORTED_TEXT_EXTENSIONS = new Set(["txt", "md", "markdown", "json", "csv", "html", "htm"]);

  function getFileExtension(fileName = "") {
    const parts = fileName.split(".");
    if (parts.length <= 1) return "";
    return parts.pop().toLowerCase();
  }

  function looksLikeTextFile(file) {
    if (!file) return false;
    const type = (file.type || "").toLowerCase();
    if (type && (type.startsWith("text/") || SUPPORTED_TEXT_TYPES.has(type))) {
      return true;
    }
    const extension = getFileExtension(file.name || "");
    return SUPPORTED_TEXT_EXTENSIONS.has(extension);
  }

  function truncateForAnalysis(text) {
    if (!text) {
      return { text: "", truncated: false };
    }
    if (text.length <= MAX_UPLOAD_CHARACTERS) {
      return { text, truncated: false };
    }
    return { text: text.slice(0, MAX_UPLOAD_CHARACTERS), truncated: true };
  }

  function formatByteLimit(limit = MAX_UPLOAD_BYTES) {
    const kilobytes = Math.round(limit / 1024);
    return `${kilobytes.toLocaleString()} KB`;
  }

  async function prepareFileForAnalysis(file) {
    if (!file) {
      return { ok: false, reason: "no-file", message: "No file selected." };
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return {
        ok: false,
        reason: "too-large",
        message: `Files up to ${formatByteLimit()} are supported in the popup. Use the dashboard for larger documents.`,
      };
    }

    if (!looksLikeTextFile(file)) {
      return {
        ok: false,
        reason: "unsupported-type",
        message: "Upload text-based files (TXT, MD, CSV, JSON, HTML) in the popup. Use the dashboard for PDFs or Word docs.",
      };
    }

    let rawText = "";
    try {
      rawText = await file.text();
    } catch (error) {
      console.error("Unable to read uploaded file", error);
      return {
        ok: false,
        reason: "read-error",
        message: "Unable to read that file. Try saving it as plain text or upload via the dashboard.",
      };
    }

    const normalized = rawText.replace(/\r\n/g, "\n").trim();
    if (!normalized) {
      return {
        ok: false,
        reason: "empty",
        message: "Uploaded file was empty. Choose a document with readable text.",
      };
    }

    const { text: truncatedText, truncated } = truncateForAnalysis(normalized);

    return {
      ok: true,
      truncatedText,
      truncated,
      originalLength: normalized.length,
    };
  }

  window.LegalDeepUpload = {
    MAX_UPLOAD_BYTES,
    MAX_UPLOAD_CHARACTERS,
    SUPPORTED_TEXT_TYPES,
    SUPPORTED_TEXT_EXTENSIONS,
    prepareFileForAnalysis,
    looksLikeTextFile,
    truncateForAnalysis,
  };
})();
