function renderDocumentCards(containerEl, docs, showDistance = false) {
	containerEl.innerHTML = "";

	for (const item of docs) {
		const article = document.createElement("article");
		article.className = "doc-card";

		const title = document.createElement("h2");
		title.textContent = item.id;

		const body = document.createElement("p");
		body.textContent = item.document;

		article.appendChild(title);
		article.appendChild(body);

		if (showDistance && typeof item.distance === "number") {
			const score = document.createElement("p");
			score.className = "distance";
			score.textContent = `Distance: ${item.distance.toFixed(4)}`;
			article.appendChild(score);
		}

		containerEl.appendChild(article);
	}
}

async function loadDocuments() {
	const statusEl = document.getElementById("status");
	const containerEl = document.getElementById("documents");

	try {
		const response = await fetch("/documents");
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const docs = await response.json();
		containerEl.innerHTML = "";

		if (!Array.isArray(docs) || docs.length === 0) {
			statusEl.textContent = "No documents found.";
			return;
		}

		statusEl.textContent = `Loaded ${docs.length} documents.`;
		renderDocumentCards(containerEl, docs);
	} catch (error) {
		statusEl.textContent = "Failed to load documents.";
		console.error(error);
	}
}

async function searchDocuments(query) {
	const statusEl = document.getElementById("search-status");
	const resultsEl = document.getElementById("search-results");

	statusEl.textContent = "Searching...";
	resultsEl.innerHTML = "";

	try {
		const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const docs = await response.json();
		if (!Array.isArray(docs) || docs.length === 0) {
			statusEl.textContent = "No matching results found.";
			return;
		}

		statusEl.textContent = `Top ${docs.length} results for "${query}"`;
		renderDocumentCards(resultsEl, docs, true);
	} catch (error) {
		statusEl.textContent = "Search failed.";
		console.error(error);
	}
}

const searchForm = document.getElementById("search-form");
const queryInput = document.getElementById("query-input");

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const query = queryInput.value.trim();
	if (!query) {
		document.getElementById("search-status").textContent = "Enter a query first.";
		return;
	}
	searchDocuments(query);
});

loadDocuments();
