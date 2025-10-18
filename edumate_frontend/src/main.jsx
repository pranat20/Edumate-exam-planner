// src/main.jsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

/* --------------------------
   Simple Error Boundary
-------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Something went wrong 😢
          </h1>
          <p className="text-gray-600">
            Please refresh the page or try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --------------------------
   Root Render
-------------------------- */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <App />
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
