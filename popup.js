// Load and display the stored CSS when the popup opens
document.addEventListener("DOMContentLoaded", function () {
	chrome.storage.local.get(["css"], function (result) {
		if (result.css) {
			document.getElementById("cssCode").value = result.css;
		}
	});
});

document.getElementById("saveBtn").addEventListener("click", () => {
	const cssCode = document.getElementById("cssCode").value;
	chrome.storage.local.set({ css: cssCode }, () => {
		console.log("CSS saved.");
		// Send a message to the content script
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: "applyCSS", css: cssCode });
		});
	});
});
