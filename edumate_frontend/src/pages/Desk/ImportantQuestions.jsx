// src/pages/Desk/ImportantQuestions.jsx
import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { API_BASE } from "../../config";

export default function ImportantQuestions() {
  const [files, setFiles] = useState([]);
  const [important, setImportant] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!files.length) {
      alert("Please upload up to 5 PDFs.");
      return;
    }
    if (files.length > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append("files", files[i]);

    try {
      const res = await fetch(`${API_BASE}/api/tools/pyq/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setImportant(data.important || []);
      } else {
        alert(data.error || "Failed to analyze PYQs");
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
          <FileText className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Important Questions from PYQs
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Upload up to 5 previous year papers in PDF format. The AI will analyze
          them and extract the most common recurring questions.
        </p>

        {/* File Upload */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-gray-600">
            {files.length
              ? `${files.length} file(s) selected`
              : "Click or drag PDF files here"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="hidden"
          />
        </label>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          {loading ? "Analyzing..." : "Find Important Questions"}
        </button>

        {/* Results */}
        {important.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📌 Common Questions
            </h3>
            <ul className="space-y-3">
              {important.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-purple-500">{i + 1}.</span>
                  <span className="text-gray-700 leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
