import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const [name, setName] = useState(""); // ✅ name for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // 🔑 Login existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful ✅");
      } else {
        // 📝 Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // ✅ Set displayName
        await updateProfile(userCredential.user, { displayName: name });

        alert("Account created successfully 🎉");
      }
      navigate("/form"); // redirect after login/signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Name input only for Sign Up */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 p-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="mt-4 text-sm text-center text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
