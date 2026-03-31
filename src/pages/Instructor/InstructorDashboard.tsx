import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import Navbar from "../../utility/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import toast, { Toaster } from "react-hot-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  lessons: any[];
  createdAt: string;
}

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get(
          "http://localhost:3000/instructor/courses",
        );
        setCourses(data.courses);
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
  }, [user]);

  const handleDelete = (courseId: string, courseTitle: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-2">
          <p className="font-medium">
            Are you sure you want to delete <strong>"{courseTitle}"</strong>?
          </p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete(courseId, courseTitle);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: "top-center",
      },
    );
  };

  const performDelete = async (courseId: string, courseTitle: string) => {
    setDeletingId(courseId);

    try {
      await api.delete(`http://localhost:3000/instructor/courses/${courseId}`);

      setCourses((prev) => prev.filter((course) => course._id !== courseId));

      toast.success(`"${courseTitle}" has been deleted successfully`, {
        duration: 4000,
      });
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Failed to delete course";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />

      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || "Instructor"} 👨‍🏫
          </h1>
                      <p className="text-gray-600 mt-2">{user?.email}</p>

          <p className="text-gray-600 mt-2">
            Manage your courses and track your performance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h2 className="text-3xl font-bold text-blue-600">
              {stats.totalCourses}
            </h2>
            <p className="text-gray-600">Courses Created</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h2 className="text-3xl font-bold text-green-600">
              {stats.totalStudents}
            </h2>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h2 className="text-3xl font-bold text-purple-600">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </h2>
            <p className="text-gray-600">Revenue</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              My Courses ({courses.length})
            </h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/create-Course")}
            >
              + Create New Course
            </button>
          </div>

          {loading ? (
            <p className="text-center py-10 text-gray-500">
              Loading your courses...
            </p>
          ) : courses.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <p className="text-gray-500 mb-4">
                You haven't created any courses yet.
              </p>
              <button
                onClick={() => navigate("/create-Course")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400">No Thumbnail</span>
                    </div>
                  )}

                  <h3 className="font-semibold text-lg line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-medium text-green-600">
                      ₹{course.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      {course.lessons?.length || 0} lessons
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 rounded text-sm transition"
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(course._id, course.title)}
                      disabled={deletingId === course._id}
                    >
                      {deletingId === course._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
