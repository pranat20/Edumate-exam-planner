import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../config.js";
import { Bell } from "lucide-react";

// Utility: format time relative
const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Notifications() {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setNotes(await res.json());
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const markRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });
      if (res.ok) fetchNotes();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Split unread and read notifications
  const unread = notes.filter((n) => !n.is_read);
  const read = notes.filter((n) => n.is_read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-10">
          <Bell className="h-7 w-7 text-[#F1C40F]" />
          <h1 className="text-3xl font-extrabold text-[#1B4F72]">
            Notifications
          </h1>
        </div>

        {/* Empty State */}
        {notes.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-md text-center">
            <Bell className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications right now 🎉</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Unread Section */}
            {unread.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  🔔 Unread
                </h2>
                <div className="space-y-4">
                  {unread.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-xl shadow-md bg-[#FFFBEA] border-l-4 border-yellow-400 animate-fadeUp"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900 font-medium">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(n.created_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => markRead(n.id)}
                          className="px-3 py-1 text-xs font-medium bg-[#3498DB] text-white rounded-lg hover:bg-[#2C80B4] transition"
                        >
                          Mark as read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read Section */}
            {read.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  ✅ Read
                </h2>
                <div className="space-y-3">
                  {read.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-xl shadow bg-white hover:shadow-md transition"
                    >
                      <p className="text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(n.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
