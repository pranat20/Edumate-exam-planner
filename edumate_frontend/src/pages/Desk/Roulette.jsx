// src/pages/Desk/Roulette.jsx
import { useState } from "react";
import { RotateCw } from "lucide-react";

export default function Roulette() {
  const [topics, setTopics] = useState(["", "", "", "", ""]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState("");

  const handleChange = (i, value) => {
    const newT = [...topics];
    newT[i] = value;
    setTopics(newT);
  };

  const spinWheel = () => {
    const filtered = topics.filter((t) => t.trim());
    if (filtered.length < 2) {
      alert("⚠️ Please enter at least 2 topics!");
      return;
    }

    const slice = 360 / filtered.length;
    const index = Math.floor(Math.random() * filtered.length);
    const target = 360 * 6 + index * slice + slice / 2; // spin 6 full rounds

    setSpinning(true);
    setRotation(target);

    setTimeout(() => {
      setSelected(filtered[index]);
      setSpinning(false);
    }, 4500);
  };

  const filtered = topics.filter((t) => t.trim());

  // create wheel background with conic-gradient
  const colors = [
    "from-yellow-400 to-pink-400",
    "from-pink-300 to-yellow-300",
  ];

  const wheelStyle = {
    background: `conic-gradient(
      ${filtered
        .map(
          (t, i) =>
            `${i % 2 === 0 ? "#FFD54F" : "#F48FB1"} ${
              (i * 360) / filtered.length
            }deg ${(i + 1) * (360 / filtered.length)}deg`
        )
        .join(", ")}
    )`,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <RotateCw className="w-8 h-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Revision Roulette</h1>
        </div>
        <p className="text-gray-600 mb-6">
          🎡 Enter up to 5 topics and spin the wheel. Revise whichever topic it
          lands on!
        </p>

        {/* Inputs */}
        <div className="space-y-3 mb-6">
          {topics.map((t, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Topic ${i + 1}`}
              value={t}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
          ))}
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          {spinning ? "🎡 Spinning..." : "Spin the Wheel"}
        </button>

        {/* Wheel */}
        <div className="mt-10 flex justify-center relative">
          <div
            className="relative w-80 h-80 rounded-full border-[12px] border-pink-300 shadow-lg transition-transform duration-[4s] ease-out flex items-center justify-center"
            style={wheelStyle}
          >
            <div className="absolute w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>

          {/* Pointer */}
          <div className="absolute top-0">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-transparent border-b-red-500 mx-auto"></div>
          </div>
        </div>

        {/* Result */}
        {selected && (
          <div className="mt-8 text-center text-lg font-semibold text-pink-600">
            ✅ Revise: <span className="underline">{selected}</span>
          </div>
        )}
      </div>
    </div>
  );
}
