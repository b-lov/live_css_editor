// debug.js
document.addEventListener("DOMContentLoaded", function () {
	chrome.storage.local.get(null, function (items) {
		document.getElementById("storageContents").textContent = JSON.stringify(
			items,
			null,
			2
		);
	});
});
