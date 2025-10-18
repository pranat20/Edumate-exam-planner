import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Bell, User, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect for shadow + background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Subjects", path: "/subjects" },
    { name: "Progress", path: "/progress" },
    { name: "Tools", path: "/desk" },
  ];

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EduMate" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold text-edublue">EduMate</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative nav-link text-sm font-medium ${
                location.pathname === link.path
                  ? "text-eduyellow font-semibold"
                  : "text-gray-700 hover:text-edublue"
              }`}
            >
              {link.name}
              {/* underline animation */}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-full bg-eduyellow transform scale-x-0 transition-transform origin-left ${
                  location.pathname === link.path ? "scale-x-100" : "hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/notifications" className="relative">
                <Bell className="w-5 h-5 text-gray-700 hover:text-edublue transition" />
                {/* Notification badge example */}
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1 text-gray-700 hover:text-edublue transition font-medium"
              >
                <User className="w-4 h-4" />
                {user.first_name || user.username}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-eduyellow text-white rounded-lg hover:bg-yellow-500 transition shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-edublue text-edublue rounded-lg hover:bg-edublue hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-eduyellow text-white rounded-lg hover:bg-yellow-500 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg px-6 py-4 space-y-3 transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block text-sm font-medium ${
              location.pathname === link.path
                ? "text-eduyellow font-semibold"
                : "text-gray-700 hover:text-edublue"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {user ? (
          <>
            <Link
              to="/notifications"
              className="flex items-center gap-2 text-gray-700 hover:text-edublue"
            >
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 font-medium text-gray-700 hover:text-edublue"
            >
              <User className="w-4 h-4" />
              {user.first_name || user.username}
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 bg-eduyellow text-white rounded-lg hover:bg-yellow-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-4 py-2 border border-edublue text-edublue rounded-lg hover:bg-edublue hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 bg-eduyellow text-white rounded-lg hover:bg-yellow-500 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
