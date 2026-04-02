import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <aside className="flex w-64 h-screen fixed left-0 bg-[#fdf3ff] flex-col p-6 space-y-4">
      <h2 className="text-2xl font-black text-[#6a1cf6]">Kinetic</h2>

      <nav className="flex flex-col gap-3 mt-6 flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 rounded-full bg-[#ebd4ff] font-bold text-[#6a1cf6]"
              : "px-4 py-2 rounded-full hover:bg-[#ebd4ff]"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 rounded-full bg-[#ebd4ff] font-bold text-[#6a1cf6]"
              : "px-4 py-2 rounded-full hover:bg-[#ebd4ff]"
          }
        >
          Create Post
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 rounded-full bg-[#ebd4ff] font-bold text-[#6a1cf6]"
              : "px-4 py-2 rounded-full hover:bg-[#ebd4ff]"
          }
        >
          Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;