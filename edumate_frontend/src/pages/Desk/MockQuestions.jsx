// src/pages/Desk/MockQuestions.jsx
import { useState } from "react";
import { Edit3, Upload } from "lucide-react";
import { API_BASE } from "../../config";

export default function MockQuestions() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/tools/mock/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions || []);
      } else {
        alert(data.error || "Failed to generate questions");
      }
    } catch (err) {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Edit3 className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Mock Questions Generator</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Upload your notes (PDF or image). The AI will generate 5–10 exam-style
          descriptive questions for practice.
        </p>

        {/* File Upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-gray-600">
            {file ? file.name : "Click or drag a file here"}
          </span>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {/* Output */}
        {questions.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📘 Generated Mock Questions
            </h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
                >
                  <strong>Q{i + 1}.</strong> {q.replace(/^Q:\s*/, "")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
