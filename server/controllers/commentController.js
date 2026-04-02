const Comment = require("../models/Comment");

// Add Comment
exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    post: req.body.postId,
    user: req.user,
    text: req.body.text,
  });

  res.json(comment);
};

// Get Comments
exports.getComments = async (req, res) => {
  const comments = await Comment.find({
    post: req.params.postId,
  }).populate("user", "name");

  res.json(comments);
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.user.toString() !== req.user)
    return res.status(401).json({ message: "Unauthorized" });

  await comment.deleteOne();

  res.json({ message: "Comment deleted" });
};