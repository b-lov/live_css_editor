// Function to apply CSS
function applyCss(css) {
	let styleTag =
		document.getElementById("liveCssEditorStyle") ||
		document.createElement("style");
	styleTag.id = "liveCssEditorStyle";
	styleTag.innerHTML = css;
	document.head.appendChild(styleTag);
}

// Apply saved CSS on page load
chrome.storage.local.get(["css"], function (result) {
	if (result.css) {
		applyCss(result.css);
	}
});

// Listen for messages to update CSS dynamically
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "applyCSS") {
		applyCss(request.css);
	}
});
