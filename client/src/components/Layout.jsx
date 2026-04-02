import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 md:ml-64">{children}</div>
    </div>
  );
};

export default Layout;