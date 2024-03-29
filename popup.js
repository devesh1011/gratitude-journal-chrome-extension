document.addEventListener("DOMContentLoaded", () => {
  var saveButton = document.getElementById("saveButton");
  var gratitudeEntry = document.getElementById("gratitudeEntry");
  var pastEntriesList = document.getElementById("pastEntriesList");

  gratitudeEntry.focus();

  gratitudeEntry.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Function to display entries saved in local storage
  function displayPastEntries(entries) {
    pastEntriesList.innerHTML = ""; // Clear previous entries
    if (entries.length === 0) {
      const noEntriesMessage = document.createElement("div");
      noEntriesMessage.classList.add("card", "text-white", "bg-dark", "mb-3");
      noEntriesMessage.innerHTML = `
        <div class="card-body">
          <p class="card-text">Write your first gratitude</p>
        </div>
      `;
      pastEntriesList.appendChild(noEntriesMessage);
    } else {
      const today = new Date();
      const filteredEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.timeStamp);
        return (
          entryDate.getDate() === today.getDate() &&
          entryDate.getMonth() === today.getMonth() &&
          entryDate.getFullYear() === today.getFullYear()
        );
      });

      const sortedEntries = filteredEntries.sort(
        (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
      ); // Sort entries from newest to oldest

      sortedEntries.forEach((entry) => {
        const card = document.createElement("div");
        card.classList.add("card", "text-white", "bg-dark", "mb-3");
        card.innerHTML = `
          <div class="card-body">
            <p class="card-text">${
              entry.entry
            } <span class="badge rounded-pill bg-light">${formatDate(
          entry.timeStamp
        )}</span></p>
          </div>
        `;
        pastEntriesList.appendChild(card);
      });
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  }

  // Function to check if a date is today
  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Request past entries from local storage when popup is opened
  chrome.storage.local.get(["entries"], (result) => {
    const entries = result.entries || [];
    displayPastEntries(entries);
  });

  saveButton.addEventListener("click", function () {
    var entry = gratitudeEntry.value.trim();
    if (entry !== "" && entry.length >= 50) {
      saveGratitudeEntry(entry);

      chrome.runtime.onMessage.addListener(function (
        message,
        sender,
        sendResponse
      ) {
        if (message.action === "displayEntries") {
          displayPastEntries(message.entries);
        }
      });
    } else {
      alert("You must write at least 50 characters in the entry");
    }
    gratitudeEntry.value = "";
    gratitudeEntry.style.height = "auto";
  });
});

function saveGratitudeEntry(entry) {
  chrome.runtime.sendMessage({ action: "saveEntry", entry: entry });
}
