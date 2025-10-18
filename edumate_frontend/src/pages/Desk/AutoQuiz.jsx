// src/pages/Desk/AutoQuiz.jsx
import { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { FileText, Upload, Timer } from "lucide-react";

export default function AutoQuiz() {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min = 300 sec
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  async function handleUpload() {
    if (!file) {
      alert("Please upload notes first!");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/tools/autoquiz/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setQuiz(data.mcqs || []);
        setTimeLeft(300);
        setSubmitted(false);
        setScore(0);
      } else {
        alert(data.error || "Failed to generate quiz");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
    setLoading(false);
  }

  function handleSelect(qIdx, opt) {
    setAnswers({ ...answers, [qIdx]: opt });
  }

  function handleSubmit() {
    let sc = 0;
    quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
  }

  // Timer effect
  useEffect(() => {
    if (!quiz.length || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quiz, submitted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Auto-Generated Quiz</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Upload your notes and attempt a 5-minute quiz with auto-generated questions!
        </p>

        {/* Upload */}
        {!quiz.length && !submitted && (
          <>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-gray-600">
                {file ? file.name : "Click or drag notes here"}
              </span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
            >
              {loading ? "Generating Quiz..." : "Start Quiz"}
            </button>
          </>
        )}

        {/* Quiz Mode */}
        {quiz.length > 0 && !submitted && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Timer className="w-5 h-5 text-pink-500" />
                Time Left: {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </div>
              <span className="text-gray-500 text-sm">
                {quiz.length} Questions
              </span>
            </div>

            {quiz.map((q, idx) => (
              <div
                key={idx}
                className="mb-6 p-4 border rounded-xl bg-gray-50 shadow-sm"
              >
                <div className="font-semibold text-gray-800">
                  Q{idx + 1}. {q.question}
                </div>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`block p-2 rounded-lg cursor-pointer border ${
                        answers[idx] === opt
                          ? "bg-pink-100 border-pink-400"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleSelect(idx, opt)}
                        className="hidden"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Result */}
        {submitted && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner animate-fadeIn text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Results</h3>
            <p className="text-lg font-semibold text-pink-600">
              Score: {score} / {quiz.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
