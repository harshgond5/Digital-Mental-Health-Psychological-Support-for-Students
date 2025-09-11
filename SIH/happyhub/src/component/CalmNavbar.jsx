import React from "react";

export default function CalmNavbar() {
  return (
    <nav className="w-full fixed top-0 left-0 h-20 flex items-center justify-between
      px-0 bg-gradient-to-r from-[#4B5563] to-[#374151] text-white shadow-lg z-50">

      {/* Logo */}
      <div className="text-2xl md:text-3xl font-bold tracking-wide ml-6 md:ml-12">
        MindEase
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-12 text-lg font-medium mr-6 md:mr-12">
        <li className="hover:text-gray-300 cursor-pointer transition-colors">Home</li>
        <li className="hover:text-gray-300 cursor-pointer transition-colors">About</li>
        <li className="hover:text-gray-300 cursor-pointer transition-colors">Exercises</li>
        <li className="hover:text-gray-300 cursor-pointer transition-colors">Contact</li>
      </ul>

      {/* Button */}
      <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full
        transition-all font-medium shadow-md hover:shadow-lg mr-6 md:mr-12">
        Start Now
      </button>

    </nav>
  );
}
