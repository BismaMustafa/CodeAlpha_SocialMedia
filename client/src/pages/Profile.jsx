import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getPosts, deletePost, updatePost } from "../services/postService";
import { getProfile, getUserById, updateProfile, followUser, deleteProfilePic } from "../services/userService";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");

  // Helper function to check if a user is in the followers array
  const isUserInFollowersArray = (followersArray, userId) => {
    if (!Array.isArray(followersArray)) return false;
    return followersArray.some((f) => {
      const fId = typeof f === 'object' ? f._id : f;
      return fId === userId;
    });
  };

  // Check if current user owns a post
  const isOwnPost = (post) => {
    if (!currentUser || !post?.user) return false;
    const currentId = String(currentUser._id || "").trim();
    const postUserId = typeof post.user === 'string' 
      ? String(post.user).trim()
      : String(post.user._id || "").trim();
    return currentId && postUserId && currentId === postUserId;
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem("token");
    try {
      await deletePost(postId, token);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete post");
    }
  };

  // Handle delete profile picture
  const handleDeleteProfilePic = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) return;
    try {
      await deleteProfilePic();
      // Update the profile state
      setProfile((prev) => ({ ...prev, profilePic: null }));
      // Update auth context
      auth?.updateUser({ ...auth.user, profilePic: null });
      alert("Profile picture deleted successfully");
    } catch (err) {
      console.error("Delete profile pic error", err);
      alert("Failed to delete profile picture");
    }
  };

  // Handle edit profile
  const handleEditProfile = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    try {
      await updateProfile({ name: editName });
      setProfile((prev) => ({ ...prev, name: editName }));
      auth?.updateUser({ ...auth.user, name: editName });
      setEditingProfile(false);
      setEditName("");
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Edit profile error", err);
      alert("Failed to update profile");
    }
  };

  // Handle edit post
  const handleEditPost = async () => {
    if (!editCaption.trim()) {
      alert("Caption cannot be empty");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await updatePost(editingPost._id, editCaption, token);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === editingPost._id ? { ...p, caption: editCaption, content: editCaption } : p
        )
      );
      setEditingPost(null);
      setEditCaption("");
      alert("Post updated successfully");
    } catch (err) {
      console.error("Edit error", err);
      alert("Failed to update post");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let profileData;

        // If userId param exists, fetch that user's profile; otherwise fetch own
        if (userId) {
          // Fetch specific user's profile from API
          const userRes = await getUserById(userId);
          profileData = userRes.data;
        } else {
          // Fetch own profile
          const profileRes = await getProfile();
          profileData = profileRes.data;
        }

        setProfile(profileData);

        // Fetch posts for this user
        const res = await getPosts();
        const userPosts = res.data.filter((post) => post.user?._id === profileData._id);
        setPosts(userPosts);

        // Check if current user is following this user
        if (userId && currentUser?._id !== profileData._id) {
          const following = currentUser?.following || [];
          setIsFollowing(isUserInFollowersArray(following, profileData._id));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      await followUser(profile._id);
      
      // Refetch current user's profile to update following list
      const currentUserRes = await getProfile();
      auth?.updateUser(currentUserRes.data);

      // If viewing another user's profile, also refetch that profile
      if (userId) {
        const userRes = await getUserById(userId);
        setProfile(userRes.data);
        
        // Update isFollowing based on the refetched profile's followers
        const isFollowingNow = isUserInFollowersArray(userRes.data.followers, currentUserRes.data._id);
        setIsFollowing(isFollowingNow);
      } else {
        // If viewing own profile, update displayed profile with fresh data
        setProfile(currentUserRes.data);
      }
    } catch (err) {
      console.error("Follow error", err);
      alert("Failed to follow user");
    }
  };

  return (
    <div className="min-h-screen pt-20 flex select-none">

      <Sidebar />

      <main className="flex-1 md:ml-64 px-6 py-12 pt-24">

        {/* Profile Info */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400">
            <div className="p-1 bg-white rounded-full">
              {currentUser?._id === profile?._id ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => navigate("/profile/upload")}
                    className="relative block w-full h-full rounded-full overflow-hidden"
                  >
                    <img
                      src={
                        profile?.profilePic
                          ? profile.profilePic.startsWith("http")
                            ? profile.profilePic
                            : `http://localhost:5000${profile.profilePic}`
                          : "https://placehold.co/150"
                      }
                      alt="profile"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-full">
                      <span className="text-white text-xs md:text-sm">Change</span>
                    </div>
                  </button>
                  {profile?.profilePic && (
                    <button
                      onClick={handleDeleteProfilePic}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      title="Delete profile picture"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <img
                  src={
                    profile?.profilePic
                      ? profile.profilePic.startsWith("http")
                        ? profile.profilePic
                        : `http://localhost:5000${profile.profilePic}`
                      : "https://placehold.co/150"
                  }
                  alt="profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center gap-4 mb-4">
              {editingProfile ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-3xl font-black border-b-2 border-[#6a1cf6] bg-transparent outline-none"
                    placeholder="Enter name"
                  />
                  <button
                    onClick={handleEditProfile}
                    className="px-3 py-1 bg-[#6a1cf6] text-white rounded-full text-sm font-semibold hover:bg-[#5d00e3]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      setEditName("");
                    }}
                    className="px-3 py-1 bg-gray-300 text-black rounded-full text-sm font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black">{profile?.name || "User"}</h2>
                  {currentUser?._id === profile?._id ? (
                    <button
                      onClick={() => {
                        setEditingProfile(true);
                        setEditName(profile?.name || "");
                      }}
                      className="px-4 py-2 bg-[#6a1cf6] text-white rounded-full font-semibold hover:bg-[#5d00e3] transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-full font-semibold ${
                        isFollowing
                          ? "bg-gray-300 text-black"
                          : "bg-gradient-to-r from-[#6a1cf6] to-[#5d00e3] text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-8 mt-6 justify-center md:justify-start">
              <div>
                <p className="font-bold">{posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">{profile?.followers?.length || 0}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-bold">{profile?.following?.length || 0}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {posts.map((post) => {
              const imageUrl = post.image
                ? post.image.startsWith("http")
                  ? post.image
                  : `http://localhost:5000${post.image}`
                : `https://placehold.co/600x400`;

              const isOwn = isOwnPost(post);

              return (
                <div key={post._id || post.id} className="relative group overflow-hidden rounded-xl">
                  <img
                    src={imageUrl}
                    className="w-full h-64 md:h-72 lg:h-80 object-cover"
                    alt={post.caption || "Post image"}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition">
                    <button className="text-white text-3xl hover:scale-110 transition">
                      ❤️
                    </button>

                    {isOwn && (
                      <>
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setEditCaption(post.caption || "");
                          }}
                          className="text-blue-400 text-2xl hover:scale-110 transition"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-400 text-2xl hover:scale-110 transition"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* Edit Post Modal */}
        {editingPost && (
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
                  onClick={() => setEditingPost(null)}
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

      </main>
    </div>
  );
};

export default Profile;