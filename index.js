#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
//import open from "open";

import startServer from "./server/server.js";

// === служебное ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === параметры запуска ===
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Использование:");
  console.error("signpdf.exe <pdf_path> <stamp1.png> [stamp2.png]");
  process.exit(1);
}

const pdfPath = path.resolve(args[0]);
const stamp1Path = path.resolve(args[1]);
const stamp2Path = args[2] ? path.resolve(args[2]) : null;

// === проверки ===
function checkFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${description}`);
    console.error(filePath);
    process.exit(1);
  }
}

checkFile(pdfPath, "PDF документ");
checkFile(stamp1Path, "Факсимиле №1");
if (stamp2Path) checkFile(stamp2Path, "Факсимиле №2");

// === temp директория ===
const tempDir = path.join(__dirname, "temp");
const stampsDir = path.join(tempDir, "stamps");

fs.mkdirSync(stampsDir, { recursive: true });

// === копирование файлов ===
const tempPdfPath = path.join(tempDir, "input.pdf");
fs.copyFileSync(pdfPath, tempPdfPath);

const tempStamp1 = path.join(stampsDir, "stamp1.png");
fs.copyFileSync(stamp1Path, tempStamp1);

let tempStamp2 = null;
if (stamp2Path) {
  tempStamp2 = path.join(stampsDir, "stamp2.png");
  fs.copyFileSync(stamp2Path, tempStamp2);
}

// === старт сервера ===
const PORT = 3000;

startServer({
  port: PORT,
  pdfPath: tempPdfPath,
  stamps: {
    stamp1: "/stamps/stamp1.png",
    stamp2: tempStamp2 ? "/stamps/stamp2.png" : null
  }
}).then(() => {
  open(`http://localhost:${PORT}`);
});
