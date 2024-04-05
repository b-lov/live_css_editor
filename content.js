// Function to apply CSS
function applyCss(css) {
	const styleTag =
		document.getElementById("liveCssEditorStyle") ||
		document.createElement("style");
	styleTag.id = "liveCssEditorStyle";
	styleTag.innerHTML = css;
	document.head.appendChild(styleTag);
}

// Get the current domain
const currentDomain = window.location.hostname;

// Apply saved CSS on page load for the current domain
chrome.storage.local.get([currentDomain], function (result) {
	if (result[currentDomain]) {
		applyCss(result[currentDomain]);
	}
});

// Listen for messages to update CSS dynamically
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "applyCSS" && request.domain === currentDomain) {
		applyCss(request.css);
	}
});
