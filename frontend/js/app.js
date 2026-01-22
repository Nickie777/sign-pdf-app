async function loadConfig() {
  const res = await fetch("/api/config");
  const config = await res.json();

  const info = document.getElementById("info");

  info.innerHTML = `
    <p>PDF: ${config.pdfUrl}</p>
    <p>Факсимиле 1: ${config.stamps.stamp1 ? "Есть" : "Нет"}</p>
    <p>Факсимиле 2: ${config.stamps.stamp2 ? "Есть" : "Нет"}</p>
  `;
}

loadConfig();

async function init() {
  const res = await fetch("/api/config");
  const config = await res.json();

  await renderPDF(config.pdfUrl);
}

init();
