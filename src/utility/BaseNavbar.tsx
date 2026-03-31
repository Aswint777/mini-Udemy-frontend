import React from "react";
import { useNavigate } from "react-router-dom";

function BaseNavbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
      
      {/* 🔹 Left - Logo */}
      <h1
        className="text-xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Mini Udemy
      </h1>

      {/* 🔹 Center - Home */}
      <div className="hidden md:flex gap-8 text-gray-700 font-medium">
        <span
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/")}
        >
          Home
        </span>
      </div>

      {/* 🔹 Right - Auth Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-700 hover:text-blue-600"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/sign-up")}
          className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default BaseNavbar;