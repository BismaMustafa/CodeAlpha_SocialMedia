// import React from "react";

// const CreatePost = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-[#fdf3ff]">
//       <h2 className="text-3xl font-bold mb-6">New Expression</h2>

//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         <div className="border-2 border-dashed rounded-2xl flex items-center justify-center p-6">
//           Upload Area
//         </div>

//         <div className="flex flex-col gap-4">
//           <textarea
//             className="border p-3 rounded-lg h-40"
//             placeholder="Write a caption..."
//           ></textarea>

//           <button className="bg-purple-600 text-white py-3 rounded-full">
//             Post
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CreatePost;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";

const CreatePost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("content", caption);
      if (image) {
        formData.append("image", image);
      }

      const res = await createPost(formData, token);

      // save a local backup for profile quick display when needed
      const existing = JSON.parse(localStorage.getItem("posts")) || [];
      localStorage.setItem("posts", JSON.stringify([res.data, ...existing]));

      alert("Post Created ✅");
      setCaption("");
      setImage(null);

      // redirect to home so new post appears there too
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Error creating post ❌");
    }
  };

  return (
    <div className="bg-[#fdf3ff] min-h-screen flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 bg-[#fdf3ff] py-8 space-y-2">
        <div className="px-6 mb-8">
          <h1 className="text-3xl font-black text-[#6a1cf6]">Kinetic</h1>
          <p className="text-sm text-[#67537c]">The Vibrant Curator</p>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="/" className="flex items-center px-6 py-3 hover:bg-[#f9edff]">
            Home
          </a>

          <a className="flex items-center bg-[#ebd4ff] text-[#6a1cf6] rounded-full mx-2 px-6 py-3 font-bold">
            Create
          </a>

          <a href="/profile" className="flex items-center px-6 py-3 hover:bg-[#f9edff]">
            Profile
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="md:ml-64 w-full flex flex-col items-center p-6 md:p-12">

        {/* Header */}
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-3xl font-extrabold text-[#38274c]">
            New Expression
          </h2>
          <p className="text-[#67537c]">
            Curate your next masterpiece for the community.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Upload */}
            <div className="relative aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-[#f9edff]">
              
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-4"
              />

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}

              {!image && (
                <>
                  <div className="text-[#6a1cf6] text-3xl mb-2">⬆️</div>
                  <p className="text-sm text-[#67537c]">
                    Upload your image
                  </p>
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">

              {/* Caption */}
              <div>
                <label className="text-xs font-bold text-[#67537c]">
                  CAPTION
                </label>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a story..."
                  className="w-full mt-2 p-4 bg-[#ebd4ff] rounded-2xl outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3 flex-wrap">
                <button className="px-4 py-2 bg-[#f9edff] rounded-full text-sm">
                  Location
                </button>

                <button className="px-4 py-2 bg-[#f9edff] rounded-full text-sm">
                  Tags
                </button>

                <button className="px-4 py-2 bg-[#f9edff] rounded-full text-sm">
                  Advanced
                </button>
              </div>

              {/* Submit */}
              <div className="mt-8 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Draft saved
                </span>

                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-[#6a1cf6] to-[#5d00e3] text-white rounded-full font-bold"
                >
                  Post 🚀
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-3xl w-full">

          <div className="bg-[#f9edff] p-6 rounded-2xl">
            <h4 className="font-bold">Aesthetic Tip</h4>
            <p className="text-sm text-[#67537c]">
              Vibrant colors perform better.
            </p>
          </div>

          <div className="bg-[#ebd4ff] p-6 rounded-2xl">
            <h4 className="font-bold">Trending</h4>
            <p className="text-sm text-[#67537c]">
              #DigitalArt is trending
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="font-bold">Learn</h4>
            <p className="text-sm text-[#67537c]">
              Improve storytelling
            </p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default CreatePost;