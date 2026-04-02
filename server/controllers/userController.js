const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Get own profile
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user)
    .populate("followers", "name profilePic")
    .populate("following", "name profilePic");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

// Get any user's profile by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("followers", "name profilePic")
    .populate("following", "name profilePic");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

// Update profile
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.profilePic = req.body.profilePic || user.profilePic;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

// Follow / Unfollow
exports.followUser = async (req, res) => {
  const user = await User.findById(req.user);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser)
    return res.status(404).json({ message: "User not found" });

  const isFollowing = user.following.includes(targetUser._id);

  if (isFollowing) {
    // Unfollow
    user.following = user.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== user._id.toString()
    );
  } else {
    // Follow
    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);
  }

  await user.save();
  await targetUser.save();

  res.json({ message: isFollowing ? "Unfollowed" : "Followed" });
};

exports.updateProfilePic = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const user = await User.findById(req.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.profilePic = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};

// Delete profile picture
exports.deleteProfilePic = async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.profilePic) {
    // Delete the file from uploads folder
    const filePath = path.join(__dirname, "..", user.profilePic);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    user.profilePic = null;
    await user.save();
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    followers: user.followers,
    following: user.following,
  });
};