// src/pages/Desk/MCQGenerator.jsx
import { useState } from "react";
import { List, Upload } from "lucide-react";
import { API_BASE } from "../../config";

export default function MCQGenerator() {
  const [file, setFile] = useState(null);
  const [mcqs, setMcqs] = useState([]);
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
      const res = await fetch(`${API_BASE}/api/tools/mcq/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setMcqs(data.mcqs || []);
      } else {
        alert(data.error || "Failed to generate MCQs");
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
          <List className="w-8 h-8 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-800">MCQ Generator</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Upload your notes (PDF or image). The AI will generate 5–10 multiple
          choice questions with options (A–D).
        </p>

        {/* File Upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
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
          className="w-full mt-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          {loading ? "Generating..." : "Generate MCQs"}
        </button>

        {/* MCQ Output */}
        {mcqs.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📝 Generated MCQs
            </h3>
            <div className="space-y-5">
              {mcqs.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
                >
                  <div className="font-semibold text-gray-800">
                    Q{idx + 1}. {m.question}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {m.options.map((opt, i) => (
                      <li
                        key={i}
                        className="text-gray-700 text-sm leading-relaxed pl-2"
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </li>
                    ))}
                  </ul>
                  {/* Answer shown for now; can hide later */}
                  <div className="mt-3 text-xs text-gray-500">
                    ✅ Answer: {m.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
