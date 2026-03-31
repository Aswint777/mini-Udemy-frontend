import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../utility/Navbar";

function EnrollmentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-10">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Enrollment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            You are now enrolled in <strong>{course?.title}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow p-10 mb-10">
          <div className="space-y-6 text-left">
            <div>
              <p className="text-gray-500 text-sm">Course</p>
              <p className="font-semibold text-lg">{course?.title}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Amount Paid</p>
              <p className="font-semibold text-2xl text-green-600">
                ₹{course?.price}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Access</p>
              <p className="font-medium">
                Lifetime Access • All Lessons Unlocked
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition"
          >
            Go to Student Dashboard
          </button>

          <button
            onClick={() => navigate("/all-courses")}
            className="border border-gray-300 hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl transition"
          >
            Browse All Courses
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-10">
          You can start learning immediately from your dashboard
        </p>
      </div>
    </div>
  );
}

export default EnrollmentSuccess;
