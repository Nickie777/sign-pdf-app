import express from "express";
import path from "path";

export default function startServer(config) {
  const app = express();

  const __dirname = path.resolve();

  app.use("/stamps", express.static(path.join(__dirname, "temp/stamps")));
  app.use("/pdf", express.static(path.join(__dirname, "temp")));

  app.get("/", (req, res) => {
    res.send(`
      <html>
        <body>
          <h2>Сервер запущен</h2>
          <p>PDF: ${config.pdfPath}</p>
        </body>
      </html>
    `);
  });

  return new Promise((resolve) => {
    app.listen(config.port, () => {
      console.log(`Server started on port ${config.port}`);
      resolve();
    });
  });
}
