import React, { useState } from "react";
import { likePost } from "../services/postService";

const LikeButton = ({ post, onLikeChange }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const token = localStorage.getItem("token");

  const handleLike = async () => {
    try {
      await likePost(post._id, token);
      setLikes((prev) => prev + 1);
      onLikeChange && onLikeChange(post._id);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-2">
      ❤️ {likes}
    </button>
  );
};

export default LikeButton;