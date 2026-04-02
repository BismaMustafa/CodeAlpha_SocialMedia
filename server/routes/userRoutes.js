const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getMe,
  getUserById,
  updateProfile,
  followUser,
  updateProfilePic,
  deleteProfilePic,
} = require("../controllers/userController");

router.get("/me", protect, getMe);
router.get("/:id", getUserById);
router.put("/me", protect, updateProfile);
router.put("/me/profile-pic", protect, upload.single("profilePic"), updateProfilePic);
router.delete("/me/profile-pic", protect, deleteProfilePic);
router.put("/follow/:id", protect, followUser);

module.exports = router;