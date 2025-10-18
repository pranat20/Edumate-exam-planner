import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { API_BASE } from "../config.js";
import { Trash2, CalendarDays, BookOpen, Tag } from "lucide-react";

export default function Subjects() {
  const { token } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    exam_date: "",
    total_units: 1,
    category: "college",
  });

  // Fetch subjects
  const fetchSubjects = async () => {
    const res = await fetch(`${API_BASE}/api/subjects/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setSubjects(await res.json());
  };

  useEffect(() => {
    if (token) fetchSubjects();
  }, [token]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/subjects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("✅ Subject added successfully!");
      setForm({ name: "", exam_date: "", total_units: 1, category: "college" });
      fetchSubjects();
    } else {
      alert("❌ Failed to add subject. Please check inputs.");
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subject?")) return;
    const res = await fetch(`${API_BASE}/api/subjects/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("🗑 Subject removed.");
      fetchSubjects();
    } else {
      alert("❌ Failed to remove subject.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-[#1B4F72] mb-6">
        📝 Subjects <span className="text-[#F1C40F]">& Exam Setup</span>
      </h1>
      <p className="text-gray-700 mb-10 max-w-2xl">
        Add your <strong>subjects, exam dates, and number of units</strong> here.
        EduMate will <span className="text-[#F1C40F] font-semibold">auto-generate</span> your study
        timetable and track your progress.
      </p>

      {/* Add Subject Form */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg mb-12 max-w-lg border"
      >
        <h2 className="text-lg font-semibold text-edublue mb-6 flex items-center gap-2">
          ➕ Add a New Subject
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Enter Subject Name (e.g. Mathematics)"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <label className="block text-gray-600 text-sm mb-1">Exam Date</label>
        <input
          name="exam_date"
          value={form.exam_date}
          onChange={onChange}
          type="date"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <label className="block text-gray-600 text-sm mb-1">
          Number of Units / Chapters
        </label>
        <input
          name="total_units"
          value={form.total_units}
          onChange={onChange}
          type="number"
          min="1"
          placeholder="e.g. 10"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-yellow-400 transition"
        />

        <label className="block text-gray-600 text-sm mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-yellow-400 transition"
        >
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="engineering">Engineering</option>
          <option value="competitive">Competitive</option>
        </select>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#F1C40F] to-yellow-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Add Subject
        </button>
      </form>

      {/* Subjects List */}
      <h2 className="text-2xl font-bold text-edublue mb-6">📋 Your Subjects</h2>
      {subjects.length === 0 ? (
        <p className="text-gray-500 italic">No subjects added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border"
            >
              <h3 className="text-xl font-bold text-eduyellow mb-3">{s.name}</h3>
              <p className="flex items-center gap-2 text-gray-700 mb-1">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <strong>Exam:</strong> {s.exam_date}
              </p>
              <p className="flex items-center gap-2 text-gray-700 mb-1">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <strong>Units:</strong> {s.total_units}
              </p>
              <p className="flex items-center gap-2 text-gray-700 mb-4">
                <Tag className="w-4 h-4 text-gray-500" />
                <strong>Category:</strong> {s.category}
              </p>

              <button
                onClick={() => deleteSubject(s.id)}
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" /> Remove Subject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
