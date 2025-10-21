const MENU_ID = "legaldeep-risk-analyze";

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
