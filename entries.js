chrome.runtime.sendMessage({ action: "getEntries" });

chrome.runtime
  .connect({ name: "entriesPort" })
  .onMessage.addListener(function (msg) {
    if (msg.entries) {
      console.log(msg.entries);
      displayEntries(msg.entries);
    }
  });

function displayEntries(entries) {
  // Display past entries in the list
  const pastEntriesList = document.getElementById("pastEntriesList");
  entries.forEach((entry) => {
    console.log(entry);
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.timestamp}: ${entry.entry}`;
    pastEntriesList.appendChild(listItem);
  });
}
