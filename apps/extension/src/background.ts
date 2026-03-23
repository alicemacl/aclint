const COMMAND = 'toggle-a11y-panel';

async function togglePanelForTab(tabId: number | undefined) {
  if (tabId == null) return;
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'toggle-panel' });
  } catch {
    // Tab may have been opened before the extension loaded, or the content script
    // did not run — inject the content script and try again.
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js'],
      });
      await new Promise((r) => setTimeout(r, 50));
      await chrome.tabs.sendMessage(tabId, { type: 'toggle-panel' });
    } catch {
      // Restricted pages (chrome://, Web Store, etc.) — cannot inject.
    }
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command !== COMMAND) return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    void togglePanelForTab(tabs[0]?.id);
  });
});

chrome.action.onClicked.addListener((tab) => {
  void togglePanelForTab(tab.id);
});
