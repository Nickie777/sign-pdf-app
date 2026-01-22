pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/frontend/lib/pdfjs/pdf.worker.js";

async function renderPDF(pdfUrl) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const container = document.getElementById("pdf-container");
  container.innerHTML = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const viewport = page.getViewport({ scale: 1.5 });

    const pageDiv = document.createElement("div");
    pageDiv.className = "pdf-page";
    pageDiv.dataset.page = pageNum;

    const canvas = document.createElement("canvas");
    canvas.className = "pdf-canvas";
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    const overlay = document.createElement("div");
    overlay.className = "overlay-layer";
    overlay.style.width = `${viewport.width}px`;
    overlay.style.height = `${viewport.height}px`;

    pageDiv.appendChild(canvas);
    pageDiv.appendChild(overlay);
    container.appendChild(pageDiv);
  }
}
