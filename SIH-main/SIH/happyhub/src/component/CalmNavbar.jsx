import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // adjust path if needed

export default function CalmNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate("/"); // redirect to login or home
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 h-20 flex items-center justify-between
      px-6 bg-gradient-to-r from-[#4B5563] to-[#374151] text-white shadow-lg z-50">

      {/* Logo */}
      <div className="text-2xl md:text-3xl font-bold tracking-wide">
        <Link to="/">MindEase</Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-6 text-lg font-medium items-center">
        <li className="hover:text-gray-300 transition-colors">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-gray-300 transition-colors">
          <Link to="/about">About</Link>
        </li>
        <li className="hover:text-gray-300 transition-colors">
          <Link to="/home">Dashbord</Link>
        </li>
        <li className="hover:text-gray-300 transition-colors">
          <Link to="/contact">Contact</Link>
        </li>

        {/* User section */}
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </div>
              )}
              <span>{user.displayName ? user.displayName : user.email}</span>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="ml-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition-colors shadow-sm"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="hover:text-gray-300 transition-colors">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>

      {/* Start Now Button */}
      <Link to="/start">
        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full
          transition-all font-medium shadow-md hover:shadow-lg">
          Start Now
        </button>
      </Link>
    </nav>
  );
}
