import React from "react";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 relative">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center transform transition hover:scale-105">
        <h2 className="text-4xl font-bold text-purple-700">Welcome to SukoonBuddy</h2>
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
}
