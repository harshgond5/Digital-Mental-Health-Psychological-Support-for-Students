// src/component/pages/CBTSection.jsx
import React, { useState } from "react";

export default function CBTSection() {
  const sessions = [
  {
    id: 1,
    title: "Session 1: Introduction to CBT",
    url: "https://www.youtube.com/embed/9c_Bv_FBE-c", // ✅ real video
  },
  {
    id: 2,
    title: "Session 2: Identifying Negative Thoughts",
    url: "https://www.youtube.com/embed/04C8JKJkYyA", // ✅ replace with real video ID
  },
  {
    id: 3,
    title: "Session 3: Coping Strategies",
    url: "https://www.youtube.com/embed/z-IR48Mb3W0", // ✅ replace with real video ID
  },
];


  const [currentSession, setCurrentSession] = useState(1);
  const [unlocked, setUnlocked] = useState([1]); // session 1 unlocked by default
  const [reflection, setReflection] = useState("");
  const [notes, setNotes] = useState([]);

  const handleSave = () => {
    if (!reflection.trim()) return alert("Please write your reflection first!");
    setNotes([...notes, { session: currentSession, text: reflection }]);
    setReflection("");
  };

  const handleVideoEnd = () => {
    const nextSession = currentSession + 1;
    if (nextSession <= sessions.length && !unlocked.includes(nextSession)) {
      setUnlocked([...unlocked, nextSession]);
    }
  };

  return (
    <div
      className="min-h-screen p-6 mt-16 flex flex-col items-center"
      style={{
        background:
          "linear-gradient(135deg, #dbeafe 0%, #fbcfe8 100%)",
      }}
    >
      <h2 className="text-3xl font-bold text-indigo-900 mb-8 drop-shadow-lg">
        🧘 CBT Therapy Sessions
      </h2>

      {/* Video Player */}
      <div className="w-full md:w-3/4 lg:w-2/3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          {sessions.find((s) => s.id === currentSession)?.title}
        </h3>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
          <iframe
            src={`${sessions.find((s) => s.id === currentSession)?.url}?enablejsapi=1`}
            title="CBT Session Video"
            className="w-full h-96 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              // Detect video end using YouTube API (simple simulation for now)
              setTimeout(() => handleVideoEnd(), 20000); // unlock next after 20s
            }}
          ></iframe>
        </div>
      </div>

      {/* Reflection Box */}
      <div className="w-full md:w-3/4 lg:w-2/3 bg-gradient-to-br from-green-100/70 to-green-200/60 
                      backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          ✍️ Reflection for {sessions.find((s) => s.id === currentSession)?.title}
        </h3>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What thoughts or feelings came up while watching?"
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm mb-4 bg-white/70"
        />
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Save Reflection
        </button>

        {/* Saved Notes */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">
            Your Reflections:
          </h4>
          <ul className="space-y-2">
            {notes
              .filter((n) => n.session === currentSession)
              .map((note, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-white/90 rounded-lg shadow-sm text-gray-700"
                >
                  {note.text}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Session List */}
      <div className="w-full md:w-3/4 lg:w-2/3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📌 Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => unlocked.includes(s.id) && setCurrentSession(s.id)}
              className={`p-4 rounded-xl shadow-md transition font-medium ${
                currentSession === s.id
                  ? "bg-indigo-600 text-white"
                  : unlocked.includes(s.id)
                  ? "bg-green-100 hover:bg-green-200 text-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
