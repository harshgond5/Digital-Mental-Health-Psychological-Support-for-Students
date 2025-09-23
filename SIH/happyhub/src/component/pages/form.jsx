import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function StressAssessmentPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    previousIncident: "",
    healthIssues: "",
    hobbies: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState(null);
  const [editForm, setEditForm] = useState(false);
  const [recommendation, setRecommendation] = useState(null); // New state for popup

  // Calculate severity based on form
  const calculateSeverity = (data) => {
    let score = 0;
    if (data.previousIncident) score += data.previousIncident.split(",").length;
    if (data.healthIssues) score += 1;

    if (score <= 1) return "Low";
    else if (score <= 3) return "Moderate";
    else return "High";
  };

  // Generate recommendation based on severity and data
  const generateRecommendation = (data, severity) => {
    if (severity === "High") return "Counselor Support & CBT Therapy recommended.";
    else if (severity === "Moderate") return "CBT Therapy & Psychology Modules recommended.";
    else return "Games & Videos to relax recommended.";
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().formSubmitted) {
          setFormData(docSnap.data());
          setSeverity(docSnap.data().severity || null);
          setSubmitted(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first");

    try {
      const calculatedSeverity = calculateSeverity(formData);
      setSeverity(calculatedSeverity);
      const rec = generateRecommendation(formData, calculatedSeverity);
      setRecommendation(rec); // Show recommendation popup

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        formSubmitted: true,
        severity: calculatedSeverity,
        recommendation: rec,
      });

      setSubmitted(true);
      setEditForm(false);
      alert("Form submitted successfully ✅");
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Failed to submit form.");
    }
  };

  if (loading) {
    return (
      <p className="p-6 mt-24 text-center text-purple-700 font-medium">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-28 bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50">
      {user ? (
        <>
          {/* Show form if not submitted or editing */}
          {(!submitted || editForm) && (
            <div className="bg-white p-6 mt-24 max-w-2xl mx-auto rounded-3xl shadow-xl hover:shadow-2xl transition">
              <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
                Stress Assessment Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Your Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <textarea
                  name="previousIncident"
                  placeholder="Previous Stressful Incidents (comma separated)"
                  value={formData.previousIncident}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <textarea
                  name="healthIssues"
                  placeholder="Health Issues (if any)"
                  value={formData.healthIssues}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <input
                  type="text"
                  name="hobbies"
                  placeholder="Your Hobbies / Interests"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white py-3 rounded-2xl shadow-md hover:bg-purple-800 transition-all font-medium"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          {/* Dashboard after submission */}
          {submitted && !editForm && (
            <div className="p-6 mt-24 max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-center text-purple-800">
                Welcome, {formData.name || user.email}!
              </h2>

              {/* Recommendation Popup */}
              {recommendation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800">
                      Recommended for you
                    </h3>
                    <p className="text-gray-700 mb-6">{recommendation}</p>
                    <button
                      onClick={() => setRecommendation(null)}
                      className="bg-purple-700 text-white px-6 py-2 rounded-xl hover:bg-purple-800 transition font-medium"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}

              {/* Refill Form Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setEditForm(true)}
                  className="bg-purple-700 text-white py-2 px-6 rounded-xl shadow-md hover:bg-purple-800 transition font-medium"
                >
                  Refill Form
                </button>
              </div>

              {/* Original Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">CBT Therapy</h3>
                  <p className="text-sm text-white/90 text-center">
                    Personalized Cognitive Behavioral Therapy videos.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Psychology Modules</h3>
                  <p className="text-sm text-white/90 text-center">
                    Explore mental health exercises and modules.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Expert Charts</h3>
                  <p className="text-sm text-white/90 text-center">
                    Track your stress and mood patterns with charts.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center h-40 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Games & Videos</h3>
                  <p className="text-sm text-white/90 text-center">
                    Relax and relieve stress with interactive content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-purple-800">Access Restricted</h2>
            <p className="text-purple-600 mt-2">
              Please login to access the Stress Assessment Form
            </p>
            <Link to="/login">
              <button className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition w-full">
                Login / Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
