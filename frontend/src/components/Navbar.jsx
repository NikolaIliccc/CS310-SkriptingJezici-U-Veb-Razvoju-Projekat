import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">GameHub</Link>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/games">Games</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={logout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
