import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

// Asegura carpeta base
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Si el front manda carpeta_imagenes
    const raw = (req.body?.carpeta_imagenes || "").trim();
    const clean = raw.replace(/^\/+|\/+$/g, ""); // sin / al inicio/fin

    const dest = clean
      ? path.join(UPLOAD_ROOT, clean)
      : UPLOAD_ROOT;

    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path
      .basename(file.originalname || "img", ext)
      .replace(/\s+/g, "-")
      .toLowerCase();

    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por imagen
});
