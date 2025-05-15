const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { loginCheck, isAdmin } = require("../middleware/auth");
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/blogs"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Public routes
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Protected routes - only admin can modify blogs
router.post("/", loginCheck, isAdmin, upload.single("featuredImage"), createBlog);
router.put("/:id", loginCheck, isAdmin, upload.single("featuredImage"), updateBlog);
router.delete("/:id", loginCheck, isAdmin, deleteBlog);

module.exports = router; 