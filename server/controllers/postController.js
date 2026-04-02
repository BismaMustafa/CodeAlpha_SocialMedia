const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const body = req.body || {};
    console.log("BODY:", body);
    console.log("USER:", req.user);

    const caption = body.caption || body.content;
    if (!caption && !req.file) {
      return res.status(400).json({ message: "Post caption/content is required" });
    }

    const post = await Post.create({
      user: req.user,
      caption,
      content: caption,
      image: req.file ? `/uploads/${req.file.filename}` : body.image || undefined,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("ERROR createPost:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("ERROR getPosts:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user) return res.status(403).json({ message: "Not allowed" });

    post.content = req.body.content || post.content;
    post.caption = req.body.content || post.caption;
    await post.save();

    const updatedPost = await post.populate("user", "name email profilePic");
    res.json(updatedPost);
  } catch (error) {
    console.error("ERROR updatePost:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user) return res.status(403).json({ message: "Not allowed" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("ERROR deletePost:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user;
    const liked = post.likes.some((id) => id.toString() === userId);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("ERROR likePost:", error);
    res.status(500).json({ message: error.message });
  }
};