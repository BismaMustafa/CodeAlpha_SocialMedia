import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fdf3ff]/80 backdrop-blur-lg flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-black text-[#38274c]">Kinetic</h1>

      <div className="hidden md:flex gap-6 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#6a1cf6] border-b-2 border-[#6a1cf6]"
              : "text-[#67537c]"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#6a1cf6] border-b-2 border-[#6a1cf6]"
              : "text-[#67537c]"
          }
        >
          Create
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-[#6a1cf6] border-b-2 border-[#6a1cf6]"
              : "text-[#67537c]"
          }
        >
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;