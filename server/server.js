const express = require("express");
const path = require("path");

module.exports = function startServer(config) {
  const app = express();
  const rootDir = process.cwd();

  app.use("/stamps", express.static(path.join(rootDir, "temp/stamps")));
  app.use("/pdf", express.static(path.join(rootDir, "temp")));
  app.use("/frontend", express.static(path.join(rootDir, "frontend")));

  app.get("/api/config", (req, res) => {
    res.json({
      pdfUrl: "/pdf/input.pdf",
      stamps: config.stamps
    });
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(rootDir, "frontend/index.html"));
  });

  return new Promise(resolve => {
    app.listen(config.port, () => {
      console.log(`Server started at http://localhost:${config.port}`);
      resolve();
    });
  });
};
