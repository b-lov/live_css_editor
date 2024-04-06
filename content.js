const applyCss = (css) => {
	// Ensure the style tag exists only once
	let styleTag =
		document.getElementById("liveCssEditorStyle") ||
		(() => {
			const tag = document.createElement("style");
			tag.id = "liveCssEditorStyle";
			document.head.appendChild(tag);
			return tag;
		})();

	styleTag.innerHTML = css;
};

const currentDomain = window.location.hostname;

// Listen for messages to update CSS dynamically
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "applyCSS" && request.domain === currentDomain) {
		applyCss(request.css);
	}
});

// Apply saved CSS on page load for the current domain
chrome.storage.local.get([currentDomain], (result) => {
	if (result[currentDomain]) applyCss(result[currentDomain]);
});
