(function () {
  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
  const MAX_UPLOAD_CHARACTERS = 60_000;
  const MAX_PDF_PAGES = 12;

  const MIME_GROUPS = {
    text: new Set([
      "text/plain",
      "text/markdown",
      "text/csv",
      "text/html",
      "application/json",
    ]),
    pdf: new Set(["application/pdf"]),
    docx: new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
    doc: new Set(["application/msword"]),
    image: new Set(["image/png", "image/jpeg", "image/jpg"]),
  };

  const EXTENSION_TO_KIND = new Map([
    ["txt", "text"],
    ["md", "text"],
    ["markdown", "text"],
    ["json", "text"],
    ["csv", "text"],
    ["html", "text"],
    ["htm", "text"],
    ["pdf", "pdf"],
    ["docx", "docx"],
    ["doc", "doc"],
    ["png", "image"],
    ["jpg", "image"],
    ["jpeg", "image"],
  ]);

  let pdfModulePromise = null;
  let tesseractWorkerPromise = null;

  function getFileExtension(fileName = "") {
    const parts = fileName.split(".");
    if (parts.length <= 1) return "";
    return parts.pop().toLowerCase();
  }

  function describeFileKind(kind) {
    switch (kind) {
      case "pdf":
        return "PDF";
      case "docx":
        return "Word";
      case "doc":
        return "Word";
      case "image":
        return "Image";
      default:
        return "Text";
    }
  }

  function normalizeWhitespace(text = "") {
    return text.replace(/[\u0000]+/g, " ").replace(/[\r\t]+/g, " ").replace(/\s+/g, " ").trim();
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
    const megabytes = limit / (1024 * 1024);
    if (megabytes < 1) {
      const kilobytes = Math.round(limit / 1024);
      return `${kilobytes.toLocaleString()} KB`;
    }
    return `${megabytes.toFixed(1)} MB`;
  }

  function detectFileKind(file) {
    const type = (file.type || "").toLowerCase();
    const extension = getFileExtension(file.name || "");

    if (type) {
      for (const [kind, mimeSet] of Object.entries(MIME_GROUPS)) {
        if (mimeSet.has(type)) {
          return kind;
        }
      }
    }

    if (EXTENSION_TO_KIND.has(extension)) {
      return EXTENSION_TO_KIND.get(extension);
    }

    if (type.startsWith("text/")) {
      return "text";
    }

    return null;
  }

  function getRuntimeUrl(relativePath) {
    if (typeof browser !== "undefined" && browser?.runtime?.getURL) {
      return browser.runtime.getURL(relativePath);
    }
    return relativePath;
  }

  async function loadPdfModule() {
    if (!pdfModulePromise) {
      const moduleUrl = getRuntimeUrl("vendor/pdf.mjs");
      pdfModulePromise = import(moduleUrl).then((module) => {
        const pdfjsLib = module.default || module;
        if (pdfjsLib?.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = getRuntimeUrl("vendor/pdf.worker.mjs");
        }
        return pdfjsLib;
      });
    }
    return pdfModulePromise;
  }

  async function getTesseractWorker() {
    if (!tesseractWorkerPromise) {
      if (!globalThis.Tesseract?.createWorker) {
        throw new Error("Tesseract library unavailable");
      }

      tesseractWorkerPromise = (async () => {
        const worker = await globalThis.Tesseract.createWorker({
          workerPath: getRuntimeUrl("vendor/tesseract/worker.min.js"),
          corePath: getRuntimeUrl("vendor/tesseract/core/tesseract-core.wasm.js"),
          langPath: getRuntimeUrl("vendor/tesseract/lang-data/"),
        });

        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        return worker;
      })().catch((error) => {
        tesseractWorkerPromise = null;
        throw error;
      });
    }

    return tesseractWorkerPromise;
  }

  async function recognizeWithTesseract(canvas) {
    const worker = await getTesseractWorker();
    const result = await worker.recognize(canvas);
    return result?.data?.text ?? "";
  }

  if (typeof window !== "undefined") {
    window.addEventListener("unload", () => {
      if (tesseractWorkerPromise) {
        const pendingWorker = tesseractWorkerPromise;
        tesseractWorkerPromise = null;
        pendingWorker
          .then((worker) => worker.terminate?.())
          .catch(() => {});
      }
    });
  }

  async function extractTextFromTextFile(file) {
    const rawText = await file.text();
    return rawText.replace(/\r\n/g, "\n");
  }

  async function extractTextFromPdf(file) {
    const pdfjsLib = await loadPdfModule();
    const data = new Uint8Array(await file.arrayBuffer());

    const doc = await pdfjsLib.getDocument({ data }).promise;
    const totalPages = Math.min(doc.numPages, MAX_PDF_PAGES);
    let collected = "";

    for (let pageIndex = 1; pageIndex <= totalPages && collected.length < MAX_UPLOAD_CHARACTERS * 1.5; pageIndex += 1) {
      const page = await doc.getPage(pageIndex);
      const content = await page.getTextContent({ normalizeWhitespace: true });
      const pageText = content.items.map((item) => item.str).join(" ").trim();
      collected += `${pageText}\n`;
    }

    return collected;
  }

  async function extractTextFromDocx(file) {
    if (typeof JSZip === "undefined") {
      throw new Error("JSZip library unavailable");
    }

    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const documentFile = zip.file("word/document.xml");
    if (!documentFile) {
      throw new Error("DOCX missing document.xml");
    }

    const xml = await documentFile.async("string");
    return xml
      .replace(/<w:tab[^>]*\/>/g, "\t")
      .replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<w:p[^>]*>/g, "")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  async function extractTextFromDoc(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let collected = "";

    for (let index = 0; index < bytes.length; index += 1) {
      const code = bytes[index];
      if (code === 0x0d || code === 0x0a) {
        collected += "\n";
        continue;
      }
      if (code >= 32 && code <= 126) {
        collected += String.fromCharCode(code);
      }
      if (collected.length > MAX_UPLOAD_CHARACTERS * 2) {
        break;
      }
    }

    return collected;
  }

  function createCanvasFromSource(source) {
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(source, 0, 0);
    return { canvas, context };
  }

  async function extractTextFromImage(file) {
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch (error) {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { canvas } = createCanvasFromSource(image);
      return recognizeWithTesseract(canvas);
    }

    const { canvas } = createCanvasFromSource(bitmap);
    bitmap.close?.();
    return recognizeWithTesseract(canvas);
  }

  async function extractTextByKind(file, kind) {
    switch (kind) {
      case "pdf":
        return extractTextFromPdf(file);
      case "docx":
        return extractTextFromDocx(file);
      case "doc":
        return extractTextFromDoc(file);
      case "image":
        return extractTextFromImage(file);
      default:
        return extractTextFromTextFile(file);
    }
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

    const kind = detectFileKind(file);
    if (!kind) {
      return {
        ok: false,
        reason: "unsupported-type",
        message: "That file format is not supported yet. Try PDF, DOCX, text, or a clear PNG/JPG image.",
      };
    }

    try {
      const extracted = await extractTextByKind(file, kind);
      const normalized = normalizeWhitespace(extracted);

      if (!normalized) {
        return {
          ok: false,
          reason: "empty",
          message: "No readable text was detected in that file. Try a clearer scan or upload via the dashboard.",
        };
      }

      const { text: truncatedText, truncated } = truncateForAnalysis(normalized);

      return {
        ok: true,
        truncatedText,
        truncated,
        originalLength: normalized.length,
        kind,
        kindLabel: describeFileKind(kind),
      };
    } catch (error) {
      console.error("Unable to process uploaded file", error);
      return {
        ok: false,
        reason: "processing-error",
        message: "We couldn't read that file. Try a different format or use the dashboard for a full upload.",
      };
    }
  }

  window.LegalDeepUpload = {
    MAX_UPLOAD_BYTES,
    MAX_UPLOAD_CHARACTERS,
    prepareFileForAnalysis,
    truncateForAnalysis,
    describeFileKind,
  };
})();
