// src/middlewares/upload.middleware.js
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

function sanitizeFolder(folder) {
  const safe = String(folder || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/(\.\.\/?)+/g, "");
  return safe;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Campo que mandaremos desde el formulario: carpeta_imagenes
    const relFolder = sanitizeFolder(req.body.carpeta_imagenes || "");
    const dest = relFolder
      ? path.join(UPLOAD_ROOT, relFolder)
      : UPLOAD_ROOT;

    fs.mkdir(dest, { recursive: true }, (err) => {
      cb(err, dest);
    });
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `${safeBase}-${unique}${ext}`);
  },
});

export const uploadProductoImagenes = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,   // 10 MB
    files: 10                     // máximo 10 imágenes por producto
  },
});
