// src/App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Desk Pages
import Desk from "./pages/Desk.jsx";
import Summarizer from "./pages/Desk/Summarizer.jsx";
import MockQuestions from "./pages/Desk/MockQuestions.jsx"; // ✅ corrected
import MCQGenerator from "./pages/Desk/MCQGenerator.jsx";
import ImportantQuestions from "./pages/Desk/ImportantQuestions.jsx"; // ✅ corrected
import Roulette from "./pages/Desk/Roulette.jsx";
import AutoQuiz from "./pages/Desk/AutoQuiz.jsx";

/* ----------------------------
   Lazy-loaded Pages
---------------------------- */
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Auth/Signup.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Subjects = lazy(() => import("./pages/Subjects.jsx"));
const Progress = lazy(() => import("./pages/Progress.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

/* ----------------------------
   Animation Variants
---------------------------- */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  duration: 0.4,
  ease: "easeInOut",
};

/* ----------------------------
   App Component
---------------------------- */
export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />
            <Route
              path="/signup"
              element={
                <PageWrapper>
                  <Signup />
                </PageWrapper>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Subjects />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Progress />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Notifications />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Profile />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Desk Tools */}
            <Route path="/desk" element={<ProtectedRoute><Desk/></ProtectedRoute>} />
            <Route path="/desk/summarizer" element={<ProtectedRoute><Summarizer/></ProtectedRoute>} />
            <Route path="/desk/mock" element={<ProtectedRoute><MockQuestions/></ProtectedRoute>} />
            <Route path="/desk/mcq" element={<ProtectedRoute><MCQGenerator/></ProtectedRoute>} />
            <Route path="/desk/important" element={<ProtectedRoute><ImportantQuestions/></ProtectedRoute>} />
            <Route path="/desk/roulette" element={<ProtectedRoute><Roulette/></ProtectedRoute>} />
            <Route path="/desk/autoquiz" element={<ProtectedRoute><AutoQuiz/></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

/* ----------------------------
   Page Transition Wrapper
---------------------------- */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        {children}
      </Suspense>
    </motion.div>
  );
}
