function saveGratitudeEntry(entry) {
  console.log(entry);
  chrome.storage.local.get(["entries"], (result) => {
    var entries = result.entries || [];

    entries.push({
      timeStamp: new Date().toISOString(),
      entry: entry,
    });
    console.log(entries);
    chrome.storage.local.set({ entries: entries }, function () {
      console.log("Entry saved successfully!");
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "saveEntry") {
    saveGratitudeEntry(message.entry);
  }
});

chrome.storage.local.get(["entries"], function (result) {
  const entries = result.entries || [];
  console.log(entries);
});

// Background script (service-worker.js)
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.action === "getEntries") {
      chrome.storage.local.get(["entries"], function (result) {
        const entries = result.entries || [];
        console.log(entries);
        port.postMessage({ entries: entries });
      });
    }
  });
});
