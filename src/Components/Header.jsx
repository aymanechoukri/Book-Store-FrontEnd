import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

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
            <Link to="/books" className="hover:text-blue-600 transition">
              Books
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <Link
            to="/register"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
          >
            Register
          </Link>
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Log in
          </Link>
        </div>

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
            to="/books"
            className="block text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Books
          </Link>

          <Link
            to="/register"
            className="block text-blue-600 border border-blue-600 rounded-xl text-center py-2 hover:bg-blue-50"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>

          <Link to="/login" className="w-full bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700">
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}
