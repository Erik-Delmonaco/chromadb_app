const form = document.getElementById("chunkForm");
const textInput = document.getElementById("textInput");
const chunkSizeInput = document.getElementById("chunkSize");
const chunkOverlapInput = document.getElementById("chunkOverlap");
const resultsEl = document.getElementById("results");
const metaEl = document.getElementById("meta");
const errorEl = document.getElementById("error");

function clearOutput() {
	errorEl.textContent = "";
	metaEl.textContent = "";
	resultsEl.innerHTML = "";
}

function showError(message) {
	errorEl.textContent = message;
}

function renderChunks(chunks) {
	resultsEl.innerHTML = "";

	if (!Array.isArray(chunks) || chunks.length === 0) {
		metaEl.textContent = "No chunks returned.";
		return;
	}

	metaEl.textContent = `Returned ${chunks.length} chunk${chunks.length === 1 ? "" : "s"}.`;

	chunks.forEach((item, index) => {
		const card = document.createElement("article");
		card.className = "chunk-card";

		const header = document.createElement("div");
		header.className = "chunk-header";
		header.textContent = `Chunk ${index + 1} • Length: ${item.len}`;

		const body = document.createElement("p");
		body.className = "chunk-body";
		body.textContent = item.chunk;

		card.appendChild(header);
		card.appendChild(body);
		resultsEl.appendChild(card);
	});
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	clearOutput();

	const text = textInput.value.trim();
	const chunk_size = Number(chunkSizeInput.value);
	const chunk_overlap = Number(chunkOverlapInput.value);

	if (!text) {
		showError("Please enter text to chunk.");
		return;
	}

	if (!Number.isInteger(chunk_size) || chunk_size <= 0) {
		showError("Chunk size must be a positive integer.");
		return;
	}

	if (!Number.isInteger(chunk_overlap) || chunk_overlap < 0) {
		showError("Chunk overlap must be a non-negative integer.");
		return;
	}

	if (chunk_overlap >= chunk_size) {
		showError("Chunk overlap must be smaller than chunk size.");
		return;
	}

	try {
		const response = await fetch("/chunk", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ text, chunk_size, chunk_overlap })
		});

		if (!response.ok) {
			const details = await response.text();
			throw new Error(`Server returned ${response.status}. ${details}`.trim());
		}

		const chunks = await response.json();
		renderChunks(chunks);
	} catch (error) {
		showError(error.message || "Request failed.");
	}
});
