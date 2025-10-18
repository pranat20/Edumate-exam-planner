// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { API_BASE } from "../config.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // used by ProtectedRoute to wait
  const [error, setError] = useState(null);

  // Fetch profile with an explicit token (useful immediately after login)
  const fetchProfile = async (accessToken = null) => {
    const t = accessToken || token;
    if (!t) {
      setUser(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/profile/`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setLoading(false);
        return data;
      }

      // If token expired and we have a refresh token, try refresh
      if (res.status === 401 && refreshToken) {
        const refRes = await fetch(`${API_BASE}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refRes.ok) {
          const refData = await refRes.json();
          localStorage.setItem("token", refData.access);
          setToken(refData.access);
          // try fetching profile again with new access
          const retry = await fetchProfile(refData.access);
          setLoading(false);
          return retry;
        } else {
          // refresh failed -> logout
          logout();
          setLoading(false);
          return null;
        }
      }

      // other non-OK (for example 403)
      logout();
      setLoading(false);
      return null;
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Network error while fetching profile");
      logout();
      setLoading(false);
      return null;
    }
  };

  // On mount: if token exists in localStorage, try fetch profile
  useEffect(() => {
    if (token) {
      // call with token that we already have
      fetchProfile(token);
    } else {
      setUser(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login -> obtain tokens, persist and fetch profile (wait for it)
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setLoading(false);
        const txt = await res.text().catch(() => "");
        setError("Login failed: " + (txt || res.status));
        return { ok: false, status: res.status };
      }

      const data = await res.json();
      // persist tokens
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      setToken(data.access);
      setRefreshToken(data.refresh);

      // Immediately fetch profile using the new access token (await so ProtectedRoute sees loading)
      await fetchProfile(data.access);

      setLoading(false);
      return { ok: true };
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error");
      setLoading(false);
      return { ok: false, err };
    }
  };

  // Signup (simple wrapper)
  const signup = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) return { ok: false, status: res.status };
      return { ok: true };
    } catch (err) {
      console.error("Signup error:", err);
      return { ok: false, err };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
