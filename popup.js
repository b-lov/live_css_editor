const queryTabs = () =>
	new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
			tabs.length ? resolve(tabs[0]) : reject("No active tab found.")
		);
	});

const loadCss = (domain) => {
	chrome.storage.local.get([domain], (result) => {
		if (result[domain])
			document.getElementById("cssCode").value = result[domain];
	});
};

const sendMessageToContentScript = (cssCode, currentDomain) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length) {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "applyCSS",
				css: cssCode,
				domain: currentDomain,
			});
		}
	});
};

document.addEventListener("DOMContentLoaded", async () => {
	let currentDomain = "";

	document.getElementById("saveBtn").addEventListener("click", () => {
		const cssCode = document.getElementById("cssCode").value;
		if (cssCode === "") {
			chrome.storage.local.remove(currentDomain, () => {
				console.log(`CSS removed for ${currentDomain}`);
				sendMessageToContentScript(cssCode, currentDomain);
			});
		} else {
			chrome.storage.local.set({ [currentDomain]: cssCode }, () => {
				console.log(`CSS saved for ${currentDomain}`);
				sendMessageToContentScript(cssCode, currentDomain);
			});
		}
	});

	try {
		const tab = await queryTabs();
		const { hostname } = new URL(tab.url);
		currentDomain = hostname;
		document.getElementById("domain").textContent = `CSS for: ${currentDomain}`;
		loadCss(currentDomain);
	} catch (error) {
		console.error(error);
	}
});
