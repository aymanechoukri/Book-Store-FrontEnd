import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { useCartStore } from "../store/cartStore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const Go = useNavigate();
  const token = Cookies.get("token");
  const { items } = useCartStore();
  const cartCount = items.length;

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("role");
    Go("/login");
  }
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="text-3xl bungee-regular bg-linear-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
          Bexy
        </h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/AllBooks" className="hover:text-blue-600 transition">
              Books
            </Link>
          </li>
          {token && (
            <li>
              <Link to="/my-books" className="hover:text-blue-600 transition">
                📚 My Books
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Buttons */}
        {!token ? (
          <div className="hidden md:flex gap-3">
            <Link
              to="/register"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Log in
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex gap-3 items-center">
            <Link
              to="/cart"
              className="relative px-4 py-2 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center gap-2"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {Cookies.get("role") === "admin" && (
              <Link to="/dashboard" className="px-4 py-2 text-blue-600 rounded-xl hover:bg-blue-50 transition">
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 hidden md:flex bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
            >
              Log out
            </button>
          </div>
        )}

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-blue-600"
          onClick={() => setOpen(!open)}
        >
          ☰
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
            to="/AllBooks"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Books
          </Link>
          {token && (
            <>
              <Link
                to="/my-books"
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => setOpen(false)}
              >
                📚 My Books
              </Link>
              <Link
                to="/cart"
                className="relative block text-gray-700 hover:text-blue-600"
                onClick={() => setOpen(false)}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="inline-block ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
                    {!token ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                className="block text-blue-600 border border-blue-600 rounded-xl text-center py-2 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>

              <Link
                to="/login"
                className="block bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 text-center"
              >
                Log in
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
