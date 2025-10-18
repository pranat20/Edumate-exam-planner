import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await signup(form.username, form.email, form.password);
    if (res.ok) {
      setSuccess("✅ Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError("❌ Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1B4F72] to-[#3498DB] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl animate-fadeUp">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-[#1B4F72]">
          Create Account
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Join <span className="font-semibold text-[#F1C40F]">EduMate</span> 🚀
        </p>

        {/* Alerts */}
        {error && (
          <div className="mt-4 p-3 text-sm bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 text-sm bg-green-100 text-green-700 rounded-md text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Username */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#F1C40F]">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              className="w-full p-2 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#F1C40F]">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              className="w-full p-2 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#F1C40F]">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full p-2 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F1C40F] text-[#1B4F72] font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-400 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3498DB] font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
