// src/pages/Desk/Summarizer.jsx
import { useState } from "react";
import { FileText, Upload, Copy, Download, CheckCircle, Sparkles } from "lucide-react";
import { API_BASE } from "../../config";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/tools/summarize/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data);
      } else {
        alert(data.error || "Failed to summarize");
      }
    } catch (err) {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  const handleCopy = () => {
    if (!summary) return;
    
    const text = `EXECUTIVE SUMMARY\n${summary.short_summary}\n\nKEY POINTS\n${summary.key_points.map((point, i) => `${i + 1}. ${point}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    
    const text = `PDF SUMMARY REPORT\nGenerated: ${new Date().toLocaleString()}\nOriginal Word Count: ${summary.word_count} words\n\nEXECUTIVE SUMMARY\n${summary.short_summary}\n\nKEY POINTS\n${summary.key_points.map((point, i) => `${i + 1}. ${point}`).join('\n\n')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${file.name.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Notes Summarizer</h1>
              <p className="text-gray-600 text-sm">Get intelligent summaries with key points extraction</p>
            </div>
          </div>

          {/* File Upload */}
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition mt-6">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">
              {file ? file.name : "Click or drag a PDF/Image file here"}
            </span>
            <span className="text-gray-400 text-sm mt-1">
              Supports PDF, PNG, JPG, JPEG
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
            onClick={handleSubmit}
            disabled={loading || !file}
            className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate Summary
              </>
            )}
          </button>
        </div>

        {/* Summary Output */}
        {summary && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Bar */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Original Document</p>
                  <p className="text-2xl font-bold text-gray-800">{summary.word_count} words</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Key Points Extracted</p>
                  <p className="text-2xl font-bold text-yellow-500">{summary.key_points?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Download summary"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 bg-yellow-500 rounded mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-800">Executive Summary</h2>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {summary.short_summary}
                </p>
              </div>
            </div>

            {/* Key Points */}
            {summary.key_points && summary.key_points.length > 0 && (
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-yellow-500 rounded mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Key Points</h2>
                </div>
                <div className="space-y-4">
                  {summary.key_points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start group hover:bg-yellow-50 p-4 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold mr-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1 pt-1">
                        {point}
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