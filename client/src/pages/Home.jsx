// import React from "react";
// import Navbar from "../components/Navbar";
// import PostCard from "../components/PostCard";

// const Home = () => {
//   return (
//     <div className="flex">
//       <Navbar />

//       <main className="flex-1 md:ml-64 p-6">
//         <div className="max-w-2xl mx-auto space-y-6">
//           <PostCard />
//           <PostCard />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;




// import React, { useEffect, useState } from "react";
// import PostCard from "../components/PostCard";
// import { getPosts } from "../services/postService";

// const Home = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const res = await getPosts();
//       setPosts(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="bg-[#fdf3ff] min-h-screen text-[#38274c] flex">
      
//       {/* Sidebar */}
//       <aside className="hidden md:flex h-screen w-64 fixed left-0 bg-[#fdf3ff] flex-col py-8 space-y-2">
//         <div className="px-8 mb-8">
//           <h1 className="text-3xl font-black text-[#6a1cf6]">Kinetic</h1>
//           <p className="text-xs uppercase">The Vibrant Curator</p>
//         </div>

//         <nav className="flex-1 space-y-2">
//           <a href="/" className="flex items-center space-x-4 bg-[#ebd4ff] text-[#6a1cf6] rounded-full px-6 py-3 mx-4 font-bold">
//             Home
//           </a>

//           <a href="/create" className="flex items-center space-x-4 px-6 py-3 mx-4 hover:bg-[#f9edff] rounded-full">
//             Create
//           </a>

//           <a href="/profile" className="flex items-center space-x-4 px-6 py-3 mx-4 hover:bg-[#f9edff] rounded-full">
//             Profile
//           </a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="pt-20 md:pl-64 w-full px-4 md:px-8">
        
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-6">
//           <input
//             placeholder="Search..."
//             className="bg-[#ebd4ff] px-4 py-2 rounded-lg w-full max-w-md"
//           />
//         </div>

//         {/* Stories (Static UI only) */}
//         <div className="flex space-x-4 overflow-x-auto mb-6">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex flex-col items-center">
//               <img
//                 src="https://i.pravatar.cc/60"
//                 className="w-16 h-16 rounded-full"
//               />
//               <span className="text-xs mt-1">user{i}</span>
//             </div>
//           ))}
//         </div>

//         {/* Posts */}
//         <div className="space-y-8">
//           {posts.map((post) => (
//             <PostCard key={post._id} post={post} />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState, useContext } from "react";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import { getPosts } from "../services/postService";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../services/userService";

const Home = () => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Ensure current user is up-to-date
    const refreshUserData = async () => {
      try {
        const profileRes = await getProfile();
        if (profileRes.data) {
          auth?.updateUser(profileRes.data);
          console.log("Home.jsx: Updated currentUser in AuthContext:", profileRes.data);
        }
      } catch (err) {
        console.log("Error refreshing user data:", err);
      }
    };

    refreshUserData();
  }, []);

  useEffect(() => {
    console.log("Home.jsx: currentUser from AuthContext:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
      localStorage.setItem("posts", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      const cached = JSON.parse(localStorage.getItem("posts")) || [];
      setPosts(cached);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
  };

  return (
    <div className="min-h-screen pt-20 flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} showEditDelete={false} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;