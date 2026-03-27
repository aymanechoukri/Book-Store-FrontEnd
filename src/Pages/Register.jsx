import { useState } from "react";
import Header from "../Components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const Go = useNavigate();

  async function submitHandl(e) {
    e.preventDefault();

    // Validation
    if (name.trim() === "") {
      return toast.error("Please enter your name");
    }

    if (email.trim() === "" || !email.includes("@")) {
      return toast.error("Please enter a valid email");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });

      console.log(res.data);
      toast.success("Registration successful!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setShow(false);
      Go("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <Header />

      <div className="flex justify-center items-center px-4 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl bungee-regular text-[#2563EB] mb-6 text-center">
            Create Account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={submitHandl}>
            {/* Name */}
            <div>
              <label className="block text-[#111827] mb-1 text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#111827] mb-1 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#111827] mb-1 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-xl p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`bg-[#1D4ED8] cursor-pointer text-white py-2 sm:py-3 rounded-xl mt-4 hover:bg-[#2563EB] transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#10B981] cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}