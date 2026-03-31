import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userLogout } from "../redux/userSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(userLogout());
    navigate("/");
  };

  const handleDashboardRedirect = () => {
    if (!user) {
      return;
    }

    if (user.role === "student") {

      navigate("/student-dashboard");
    } else if (user.role === "instructor") {
      navigate("/instructor-dashboard");
    }

    setOpen(false);
  };

  return (
    <div className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
      <h1
        className="text-xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Mini Udemy
      </h1>

      <div className="hidden md:flex gap-8 text-gray-700 font-medium">
        <span
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/home")}
        >
          Home
        </span>
        <span
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/about")}
        >
          About
        </span>
        <span
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/all-courses")}
        >
          Course
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          ▼
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
            <button
              onClick={handleDashboardRedirect}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
