import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLoginWithSignupSafe() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [collegePassword, setCollegePassword] = useState(""); // for signup verification
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const COLLEGE_PASSWORD = "GNIOT"; // Only users with this can signup

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email.endsWith("@admin.com")) navigate("/admin");
        else auth.signOut();
      } else setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLoginOrSignup = async (e) => {
    e.preventDefault();
    try {
      let trimmedEmail = email.trim();

      if (!trimmedEmail) return alert("Enter your email");

      // --- FIX: ALWAYS use only username, append @admin.com ---
      // Remove any extra @ parts if user typed full email by mistake
      const username = trimmedEmail.split("@")[0];
      const adminEmail = `${username}@admin.com`;

      if (isSignup) {
        if (collegePassword !== COLLEGE_PASSWORD) {
          alert("Incorrect college password. Signup denied.");
          return;
        }

        await createUserWithEmailAndPassword(auth, adminEmail, password);
        alert("Signup successful! You can now login.");
        setIsSignup(false);
        setEmail("");
        setPassword("");
        setCollegePassword("");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, password);

        if (!userCredential.user.email.endsWith("@admin.com")) {
          alert("This is Admin login only");
          await auth.signOut();
          return;
        }

        alert("Admin login successful!");
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p className="text-center mt-20">Checking login...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col space-y-6">
        <h2 className="text-3xl font-bold text-center">{isSignup ? "Admin Signup" : "Admin Login"}</h2>
        <p className="text-gray-500 text-center mb-4">
          {isSignup
            ? "Enter your details and college password to signup"
            : "Only internal counselors/admins can login here"}
        </p>

        <form onSubmit={handleLoginOrSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Admin Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="College Verification Password"
              value={collegePassword}
              onChange={(e) => setCollegePassword(e.target.value)}
              className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
              required
            />
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200"
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            {isSignup ? "Login here" : "Signup"}
          </span>
        </p>
      </div>
    </div>
  );
}
