const MENU_ID = "legaldeep-risk-analyze";
let uploadWindowId = null;

async function openUploadWindow() {
  const url = browser.runtime.getURL("upload.html");

  if (uploadWindowId) {
    try {
      await browser.windows.update(uploadWindowId, { focused: true });
      return;
    } catch (error) {
      uploadWindowId = null;
    }
  }

  try {
    const created = await browser.windows.create({
      url,
      type: "popup",
      width: 520,
      height: 680,
    });
    uploadWindowId = created?.id ?? null;
  } catch (error) {
    console.error("Unable to open upload window", error);
  }
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: MENU_ID,
    title: "Analyze with LegalDeep AI",
    contexts: ["selection"],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) return;
  await browser.tabs.sendMessage(tab.id, {
    type: "LEGALDEEP_ANALYZE_SELECTION",
    selectionText: info.selectionText || "",
  });
});

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "LEGALDEEP_OPEN_UPLOAD_WINDOW") {
    await openUploadWindow();
    return;
  }

  if (message.type === "LEGALDEEP_OPEN_SIDEPANEL") {
    const tabId = sender.tab?.id;
    if (!tabId) return;
    try {
      await browser.browserAction.openPopup();
    } catch (error) {
      console.warn("Unable to open popup from message", error);
    }
  }
});

browser.windows.onRemoved.addListener((windowId) => {
  if (windowId === uploadWindowId) {
    uploadWindowId = null;
  }
});
