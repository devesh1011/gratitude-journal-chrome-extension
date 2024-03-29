function saveGratitudeEntry(entry) {
  chrome.storage.local.get(["entries"], (result) => {
    var entries = result.entries || [];

    entries.push({
      timeStamp: new Date().toISOString(),
      entry: entry,
    });
    chrome.storage.local.set({ entries: entries }, () => {
      // Send message to background script (popup.js) to request displaying updated entries
      chrome.runtime.sendMessage({
        action: "displayEntries",
        entries: entries,
      });
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "saveEntry") {
    saveGratitudeEntry(message.entry);
  }
});
