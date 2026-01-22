#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const startServer = require("./server/server");

// ===============================
// 1. Чтение параметров запуска
// ===============================
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Использование:");
  console.error("signpdf.exe <pdf_path> <stamp1.png> [stamp2.png]");
  process.exit(1);
}

const pdfPath = path.resolve(args[0]);
const stamp1Path = path.resolve(args[1]);
const stamp2Path = args[2] ? path.resolve(args[2]) : null;

// ===============================
// 2. Проверка файлов
// ===============================
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

// ===============================
// 3. Подготовка temp директорий
// ===============================
const rootDir = process.cwd();
const tempDir = path.join(rootDir, "temp");
const stampsDir = path.join(tempDir, "stamps");

fs.mkdirSync(stampsDir, { recursive: true });

// ===============================
// 4. Копирование файлов
// ===============================
fs.copyFileSync(pdfPath, path.join(tempDir, "input.pdf"));
fs.copyFileSync(stamp1Path, path.join(stampsDir, "stamp1.png"));

if (stamp2Path) {
  fs.copyFileSync(stamp2Path, path.join(stampsDir, "stamp2.png"));
}

// ===============================
// 5. Запуск сервера
// ===============================
const PORT = 3000;

startServer({
  port: PORT,
  stamps: {
    stamp1: "/stamps/stamp1.png",
    stamp2: stamp2Path ? "/stamps/stamp2.png" : null
  }
})
  .then(() => {
    const url = `http://localhost:${PORT}`;
    console.log(`Открытие браузера: ${url}`);

    // ===============================
    // 6. Открытие браузера (Windows)
    // ===============================
    exec(`start "" "${url}"`);
  })
  .catch(err => {
    console.error("Ошибка запуска сервера:", err);
    process.exit(1);
  });
