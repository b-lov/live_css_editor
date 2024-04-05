document.addEventListener("DOMContentLoaded", function () {
	let currentDomain = "";

	// Function to get the current tab
	function getCurrentTab() {
		return new Promise((resolve, reject) => {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				if (tabs.length > 0) resolve(tabs[0]);
				else reject("No active tab found.");
			});
		});
	}

	// Load CSS from storage
	function loadCss(domain) {
		chrome.storage.local.get([domain], function (result) {
			if (result[domain]) {
				document.getElementById("cssCode").value = result[domain];
			}
		});
	}

	// Save CSS to storage
	document.getElementById("saveBtn").addEventListener("click", () => {
		const cssCode = document.getElementById("cssCode").value;
		chrome.storage.local.set({ [currentDomain]: cssCode }, () => {
			console.log("CSS saved for " + currentDomain);
			// Optionally, send a message to content scripts to apply the CSS immediately
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "applyCSS",
					css: cssCode,
					domain: currentDomain,
				});
			});
		});
	});

	// Display the current domain and load the stored CSS for it
	getCurrentTab()
		.then((tab) => {
			const url = new URL(tab.url);
			currentDomain = url.hostname;
			document.getElementById(
				"domain"
			).textContent = `CSS for: ${currentDomain}`;
			loadCss(currentDomain);
		})
		.catch((error) => console.error(error));
});
