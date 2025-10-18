import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../config.js";
import { User, Lock } from "lucide-react";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    institution: "",
    grade_or_year: "",
    profile_pic: null,
  });
  const [status, setStatus] = useState(null);

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Fetch profile
  useEffect(() => {
    if (!token) return;
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    const res = await fetch(`${API_BASE}/api/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        bio: data.bio || "",
        institution: data.institution || "",
        grade_or_year: data.grade_or_year || "",
        profile_pic: null,
      });
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onFileChange = (e) =>
    setForm({ ...form, profile_pic: e.target.files[0] });

  // ✅ FIXED Submit handler (nest user fields)
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // User fields nested
    const userFields = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
    };
    formData.append("user", JSON.stringify(userFields));

    // Profile fields
    if (form.bio) formData.append("bio", form.bio);
    if (form.institution) formData.append("institution", form.institution);
    if (form.grade_or_year) formData.append("grade_or_year", form.grade_or_year);
    if (form.profile_pic) formData.append("profile_pic", form.profile_pic);

    try {
      const res = await fetch(`${API_BASE}/api/profile/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setStatus({ type: "success", msg: "✅ Profile updated!" });
        fetchProfile();
      } else {
        setStatus({ type: "error", msg: "❌ Failed to update profile." });
      }
    } catch {
      setStatus({ type: "error", msg: "⚠️ Network error. Try again." });
    }
  };

  // Change password handler
  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordStatus({ type: "error", msg: "❌ Passwords do not match." });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/change-password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }),
      });

      if (res.ok) {
        setPasswordStatus({
          type: "success",
          msg: "✅ Password changed successfully!",
        });
        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setPasswordStatus({
          type: "error",
          msg: "❌ Failed to change password.",
        });
      }
    } catch {
      setPasswordStatus({ type: "error", msg: "⚠️ Network error. Try again." });
    }
  };

  if (!profile)
    return (
      <div className="p-6 text-center text-gray-600">Loading profile...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#F1C40F] text-white flex items-center justify-center rounded-full shadow-lg">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B4F72]">Profile ✉︎</h1>
            <p className="text-gray-500">Manage your personal & academic info</p>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Profile Information (Read Only) */}
<div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
  <h2 className="text-lg font-semibold text-[#1B4F72] mb-3">
    👤 Personal Information
  </h2>

  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm text-gray-500 mb-1">Username</label>
      <p className="p-3 border rounded-lg bg-gray-50 text-gray-800 font-medium">
        {profile?.user?.username || "Not provided"}
      </p>
    </div>

    <div>
      <label className="block text-sm text-gray-500 mb-1">Email</label>
      <p className="p-3 border rounded-lg bg-gray-50 text-gray-800 font-medium">
        {profile?.user?.email || "Not provided"}
      </p>
    </div>
  </div>
</div>


        {/* Change Password Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-6 w-6 text-[#F1C40F]" />
            <h2 className="text-lg font-semibold text-[#1B4F72]">
              Change Password
            </h2>
          </div>

          {passwordStatus && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                passwordStatus.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {passwordStatus.msg}
            </div>
          )}

          <form onSubmit={onPasswordSubmit} className="space-y-4">
            <input
              type="password"
              name="old_password"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, old_password: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:outline-none"
              placeholder="Current password"
              required
            />
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new_password: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:outline-none"
              placeholder="New password"
              required
            />
            <input
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirm_password: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:outline-none"
              placeholder="Confirm new password"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#3498DB] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#2C80B4] transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
