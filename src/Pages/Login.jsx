import { useState } from "react";
import Header from "../Components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const Go = useNavigate();

  async function submitHandl(e) {
    e.preventDefault();

    // Validation
    if (email.trim() === "" || !email.includes("@")) {
      return toast.error("Please enter a valid email");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      toast.success("Login successful!");

      // Reset form
      setEmail("");
      setPassword("");
      setShow(false);
      Cookies.set("token", res.data.token, {
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax",
      });
      Cookies.set("role", res.data.role, {
        expires: 1,
        sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax",
      });
      Go("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
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
            Login
          </h1>

          <form className="flex flex-col gap-4" onSubmit={submitHandl}>
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
                  <i
                    className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
