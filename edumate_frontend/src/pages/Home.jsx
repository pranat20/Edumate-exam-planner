import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Calendar,
  Brain,
  Trophy,
  Zap,
  PieChart,
  BookOpen,
  Bell,
  Users,
  HelpCircle,
  ClipboardCheck,
  FileText
} from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);

  const features = [
    {
      title: "Auto Tasks Generation",
      desc: "Generate daily study items from your syllabus and exam dates automatically.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      colorBg: "bg-yellow-50",
      accent: "#F1C40F",
    },
    {
      title: "Track Your Progress",
      desc: "See your completion percentage and upcoming tasks clearly.",
      icon: <PieChart className="w-6 h-6 text-blue-500" />,
      colorBg: "bg-blue-50",
      accent: "#3498DB",
    },
    {
      title: "Get Smart Reminders",
      desc: "Get exam reminders and notifications to keep your studies on track.",
      icon: <Bell className="w-6 h-6 text-green-500" />,
      colorBg: "bg-green-50",
      accent: "#27AE60",
    },
    {
      title: "AI Notes Summarizer",
      desc: "Upload your syllabus and let EduMate structure your learning path.",
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      colorBg: "bg-purple-50",
      accent: "#8E44AD",
    },
    {
      title: "Mock Questions Generator",
      desc: "Upload your notes and get mock tests based on them",
      icon: <ClipboardCheck className="w-6 h-6 text-pink-500" />,
      colorBg: "bg-pink-50",
      accent: "#E91E63",
    },
    {
      title: "Auto-Generated Quizzes",
      desc: "Get AI-powered quizzes tailored to your subjects for smarter exam prep.",
      icon: <Brain className="w-6 h-6 text-indigo-500" />,
      colorBg: "bg-indigo-50",
      accent: "#3F51B5",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1B4F72] to-[#3498DB] text-white overflow-hidden">
        <div className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="animate-fadeUp">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow">
              "Your <span className="text-[#F1C40F]"> Smart Study </span>Companion"💡
            </h1>
            <p className="text-lg text-gray-200 mb-10 max-w-lg">
              Organize your timetable, track tasks, and monitor progress –
              all in one place with EduMate.
            </p>

            <div className="flex flex-wrap gap-4">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="px-6 py-3 bg-[#F1C40F] text-[#1B4F72] font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white text-[#1B4F72] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-[#F1C40F] text-[#1B4F72] font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Content - Mock Dashboard */}
          <div className="relative animate-fadeUp">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1B4F72]">
                    Demo Planner
                  </h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-[#F1C40F]/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#F1C40F]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1B4F72]">
                        Mathematics
                      </div>
                      <div className="text-xs text-gray-500">
                        9:00 AM - 10:30 AM
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-[#3498DB]/10 rounded-lg">
                    <Brain className="h-5 w-5 text-[#3498DB]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1B4F72]">
                        Physics
                      </div>
                      <div className="text-xs text-gray-500">
                        11:00 AM - 12:30 PM
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-[#1B4F72]/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-[#1B4F72]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1B4F72]">
                        Chemistry
                      </div>
                      <div className="text-xs text-gray-500">
                        2:00 PM - 3:30 PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Progress Today</span>
                    <span className="text-sm font-semibold text-[#1B4F72]">
                      75%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#F1C40F] to-[#3498DB] h-2 rounded-full w-3/4 animate-pulse-slow"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#F1C40F] rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#3498DB] rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1B4F72] mb-14">
            🤔 Why Choose <span className="text-[#F1C40F]">EduMate?</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const isFuture = idx >= features.length - 3;
              const title =
                idx === features.length - 1
                  ? "Auto-Generated Quizzes"
                  : f.title;
              const desc =
                idx === features.length - 1
                  ? "Get AI-powered quizzes tailored to your subjects for smarter exam prep."
                  : f.desc;

              return (
                <div
                  key={idx}
                  className={`p-6 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-2 ${
                    isFuture ? "" : ""
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center p-3 rounded-lg ${f.colorBg} mb-4`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1B4F72]">
                    {title}
                  </h3>
                  <p className="text-gray-600">{desc}</p>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: f.accent }}
                      />
                      <div>Mobile + Desktop</div>
                    </div>
                    {isFuture ? (
                      <span className="">
                        
                      </span>
                    ) : (
                      <div
                        className="font-medium"
                        style={{ color: f.accent }}
                      >
                        
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-2xl p-8 shadow-lg border">
          <div>
            <h4 className="text-2xl font-semibold text-[#1B4F72] mb-2">
              Ready to plan smarter?
            </h4>
            <p className="text-gray-600">
              Sign up and let EduMate create your revision plan automatically.
            </p>
          </div>

          {!user ? (
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 bg-[#F1C40F] text-[#1B4F72] rounded-lg font-semibold shadow hover:bg-yellow-400 transition"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-[#1B4F72] text-[#1B4F72] rounded-lg font-semibold hover:bg-[#1B4F72] hover:text-white transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-[#1B4F72] text-white rounded-lg font-semibold shadow hover:bg-[#163a56] transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
