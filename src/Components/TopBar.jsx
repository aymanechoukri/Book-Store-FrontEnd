import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const Go = useNavigate();

  const token = Cookies.get("token"); // بدل localStorage

  function handleLogout() {
    Cookies.remove("token");
    Go("/login");
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl bungee-regular bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* Links */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/books" className="hover:text-blue-600 transition">
              Books
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        {token ? (
          <div className="hidden md:flex items-center gap-4">
            
            {/* User */}
            <div className="flex items-center gap-2 text-gray-700">
              <i className="fa-solid fa-user text-blue-600"></i>
              <span className="text-sm">User</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        )}

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-blue-600"
          onClick={() => setOpen(!open)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white shadow-md">
          
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/books"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Books
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white rounded-xl py-2 hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}