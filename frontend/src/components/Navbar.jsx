import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div>
        <Link to="/" className="mr-4">Home</Link>
        {user && <Link to="/games" className="mr-4">Games</Link>}
        {user?.role === "admin" && <Link to="/admin" className="mr-4">Admin Panel</Link>}
      </div>
      <div>
        {user ? (
          <>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
