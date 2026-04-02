import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import { getComments, addComment } from "../services/commentService";
import { deletePost, updatePost } from "../services/postService";
import { AuthContext } from "../context/AuthContext";

const PostCard = ({ post, onPostDeleted, showEditDelete = true }) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;

  // Memoized ownership check - recalculate only when currentUser or post changes
  const isOwnerOfPost = useMemo(() => {
    if (!currentUser || !post?.user) {
      console.log(`[PostCard ${post?._id}] Early exit: no currentUser or post.user`);
      return false;
    }
    
    const currentId = String(currentUser._id || currentUser.id || "").trim();
    const postUserId = typeof post.user === 'string' 
      ? String(post.user).trim()
      : String(post.user._id || post.user.id || "").trim();
    
    const isOwner = !!(currentId && postUserId && currentId === postUserId);
    
    console.log(`[PostCard ${post?._id}] Ownership check:`, {
      currentId: `"${currentId}"`,
      postUserId: `"${postUserId}"`,
      currentUserId: currentUser._id,
      postUserData: post.user,
      isOwner,
    });
    
    return isOwner;
  }, [currentUser?._id, currentUser?.id, post.user?._id, post.user?.id, post.user, post._id]);

  // Only show edit/delete if it's the user's own post AND showEditDelete is true
  const shouldShowEditDelete = isOwnerOfPost && showEditDelete;

  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `http://localhost:5000${post.image}`
    : "https://placehold.co/600x400";

  const profilePicUrl = post.user?.profilePic
    ? post.user.profilePic.startsWith("http")
      ? post.user.profilePic
      : `http://localhost:5000${post.user.profilePic}`
    : `https://i.pravatar.cc/40?u=${post.user?._id}`;

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption || "");

  const fetchComments = async () => {
    try {
      const res = await getComments(post._id);
      setComments(res.data);
    } catch (err) {
      console.error("Comment load error", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const handleComment = async () => {
    const token = localStorage.getItem("token");
    if (!commentText.trim()) return;
    try {
      await addComment(post._id, commentText, token);
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Comment create error", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem("token");
    try {
      await deletePost(post._id, token);
      onPostDeleted && onPostDeleted(post._id);
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete post");
    }
  };

  const handleEditPost = async () => {
    if (!editCaption.trim()) {
      alert("Caption cannot be empty");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await updatePost(post._id, editCaption, token);
      post.caption = editCaption;
      setIsEditingPost(false);
      alert("Post updated successfully");
    } catch (err) {
      console.error("Edit error", err);
      alert("Failed to update post");
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div
          onClick={() => navigate(`/profile/${post.user?._id}`)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-70"
        >
          <img
            src={profilePicUrl}
            className="w-10 h-10 rounded-full object-cover"
            alt={post.user?.name || "user"}
          />
          <div>
            <h3 className="font-bold">{post.user?.name}</h3>
          </div>
        </div>

        {shouldShowEditDelete && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditingPost(true);
              }}
              className="text-blue-500 hover:text-blue-700 font-bold"
            >
              ✎
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-[520px] md:h-[560px] lg:h-[620px] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          className="w-full h-full object-contain object-center"
          alt={post.caption || "Post Image"}
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <LikeButton post={post} />
        <p className="mt-2 text-sm">
          <span className="font-bold">{post.user?.name}</span> {post.caption}
        </p>

        <div className="mt-4">
          <button
            onClick={() => setShowCommentInput((prev) => !prev)}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
          >
            {showCommentInput ? "Hide Comment" : "Comment"}
          </button>

          {showCommentInput && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-2 py-1"
                />
                <button
                  onClick={handleComment}
                  className="px-3 py-1 bg-indigo-500 text-white rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
            {comments.map((c) => (
              <div key={c._id} className="text-sm">
                <span className="font-bold">{c.user?.name || "Guest"}:</span> {c.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      {isEditingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Enter post caption..."
              className="w-full border rounded-lg p-3 mb-4 h-24 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditingPost(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;