const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();
const uploadDirectory = path.join(__dirname, "..", "..", "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDirectory);
  },
  filename(_req, file, cb) {
    const extension = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(null, `${safeName}-${Date.now()}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (/image\/(jpeg|jpg|png|webp)/i.test(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", protect, admin, (req, res) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    const baseUrl = process.env.SERVER_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
    const imageUrl = new URL(`/uploads/${req.file.filename}`, baseUrl).toString();

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl,
        filename: req.file.filename,
      },
    });
  });
});

module.exports = router;
