const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const controllers = require("../controllers/postController");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postController");

console.log("Controllers:", controllers);
router.post("/", protect, upload.single("image"), createPost);
router.get("/", getPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/like/:id", protect, likePost);

module.exports = router;