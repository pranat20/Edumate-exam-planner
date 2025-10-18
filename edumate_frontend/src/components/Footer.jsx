import React from "react";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1B4F72] text-white mt-20 relative z-10">
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-fadeUp">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-eduyellow tracking-wide">EduMate</h2>
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            Your smart study companion to track progress, manage subjects,
            auto-generate timetables, and stay ahead with insights & reminders.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
          <ul className="space-y-2 text-gray-300">
            {["About", "Careers", "Blog"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="relative hover:text-eduyellow transition duration-300 group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-eduyellow transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Resources</h3>
          <ul className="space-y-2 text-gray-300">
            {["Help Center", "Guides", "Community"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="relative hover:text-eduyellow transition duration-300 group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-eduyellow transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
          <ul className="space-y-2 text-gray-300">
            {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="relative hover:text-eduyellow transition duration-300 group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-eduyellow transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EduMate. All rights reserved.</p>
          <div className="mt-3 sm:mt-0 flex gap-5">
            <a href="#" className="hover:text-eduyellow transition" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-eduyellow transition" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="#" className="hover:text-eduyellow transition" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
