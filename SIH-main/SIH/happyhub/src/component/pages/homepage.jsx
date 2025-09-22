import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState("😊");
  const [stress, setStress] = useState(5);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleMoodChange = (newMood) => setMood(newMood);
  const handleStressChange = (e) => setStress(e.target.value);

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 relative">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center transform transition hover:scale-105">
          <h2 className="text-4xl font-bold text-purple-700">Welcome to MindEase</h2>
          <p className="text-gray-600 mt-3">
            Login to access your personalized mental wellness dashboard
          </p>
          <Link to="/login">
            <button className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all w-full font-semibold">
              Login / Sign Up
            </button>
          </Link>
        </div>

        <div className="fixed bottom-10 w-full flex justify-center">
          <nav className="bg-white shadow-xl rounded-full px-8 py-4 flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 font-medium">Contact</Link>
          </nav>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-green-100 to-purple-100 relative pb-32">
      <div className="mt-24 p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-700">
          Hello, {user.displayName || user.email}!
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mood */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all">
            <h3 className="font-semibold text-lg">Mood</h3>
            <div className="text-4xl my-3">{mood}</div>
            <div className="flex justify-center flex-wrap gap-3 text-2xl">
              {["😊", "😐", "😔", "😢", "😡"].map((e) => (
                <button
                  key={e}
                  onClick={() => handleMoodChange(e)}
                  className={`transition-transform transform hover:scale-125 ${mood === e ? "scale-125" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Stress */}
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all">
            <h3 className="font-semibold text-lg">Stress Level</h3>
            <p className="text-2xl my-2">{stress}</p>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={handleStressChange}
              className="w-full h-2 rounded-full accent-red-500 cursor-pointer"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
            <div className="flex flex-col gap-3 mt-3">
              <Link to="/cbt">
                <button className="bg-white text-green-600 w-full py-2 rounded-2xl hover:bg-green-100 transition font-medium">
                  CBT Therapy
                </button>
              </Link>
              <Link to="/memory">
                <button className="bg-white text-green-600 w-full py-2 rounded-2xl hover:bg-green-100 transition font-medium">
                  Memory Journal
                </button>
              </Link>
              <Link to="/audio">
                <button className="bg-white text-green-600 w-full py-2 rounded-2xl hover:bg-green-100 transition font-medium">
                  Community Audio
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-all">
          <h2 className="font-semibold text-xl mb-3 text-purple-700">Insights</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Track your mood & stress daily to identify patterns</li>
            <li>Use CBT videos and journaling to reduce stress</li>
            <li>Engage in community audio sessions for peer support</li>
            <li>Personalized suggestions appear based on your entries</li>
          </ul>
        </div>

        <p className="text-sm text-center text-gray-500 mt-4">
          Last login: {user.metadata.lastSignInTime}
        </p>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-10 w-full flex justify-center">
        <nav className="bg-white shadow-xl rounded-full px-8 py-4 flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-purple-600 font-medium">Contact</Link>
        </nav>
      </div>
    </div>
  );
}
