import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { User, Lock } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form.username, form.password);
    if (res.ok) navigate("/dashboard");
    else setError("❌ Invalid username or password.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1B4F72] to-[#3498DB] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl animate-fadeUp">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-[#1B4F72]">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Login to <span className="font-semibold text-[#F1C40F]">EduMate</span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 text-sm bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <Link
            to=""
            className="block text-[#3498DB] hover:underline"
          >
            Forgot Password?
          </Link>
          <p>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#3498DB] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
