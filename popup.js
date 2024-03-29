document.addEventListener("DOMContentLoaded", () => {
  var saveButton = document.getElementById("saveButton");
  var gratitudeEntry = document.getElementById("gratitudeEntry");

  gratitudeEntry.focus();

  gratitudeEntry.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  saveButton.addEventListener("click", function () {
    var entry = gratitudeEntry.value.trim();
    if (entry !== "" && entry.length >= 50) {
      saveGratitudeEntry(entry);
      alert("Entry saved successfully");
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
