import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import Navbar from "../../utility/Navbar";
import api from "../../axios";
import toast, { Toaster } from "react-hot-toast";

interface EnrolledCourse {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    lessons: any[];
  };
  progress: number;
  status: "active" | "completed";
  enrolledAt: string;
  lastAccessedAt: string;
}

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/enrollments/my-courses");
        setEnrolledCourses(data.enrollments || []);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const handleAccessCourse = (courseId: string) => {
    navigate(`/my-learning/${courseId}`);
  };

  const handleViewCertificate = (courseId: string, courseTitle: string) => {
    navigate(`/certificate/${courseId}`, {
      state: { courseTitle },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-center" />

      <div className="p-6">
        <div className="bg-white p-8 rounded-3xl shadow mb-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-5xl">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-600 mt-2">{user?.email}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="text-gray-500">Role:</span>{" "}
                <span className="font-medium capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">My Courses</h2>
            <p className="text-gray-500 text-lg">
              {enrolledCourses.length}{" "}
              {enrolledCourses.length === 1 ? "course" : "courses"}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Loading your courses...</p>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl shadow text-center">
              <p className="text-2xl text-gray-700 mb-4">
                You haven't enrolled in any courses yet
              </p>
              <button
                onClick={() => navigate("/all-courses")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-lg transition"
              >
                Browse Available Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.course;
                const isCompleted =
                  enrollment.status === "completed" ||
                  enrollment.progress === 100;

                return (
                  <div
                    key={enrollment._id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isCompleted && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                          COMPLETED
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <h3 className="font-semibold text-2xl line-clamp-2 mb-4 leading-tight">
                        {course.title}
                      </h3>

                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-700">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isCompleted ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccessCourse(course._id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-medium transition text-sm"
                        >
                          {isCompleted ? "Review Course" : "Continue Learning"}
                        </button>

                        {isCompleted && (
                          <button
                            onClick={() =>
                              handleViewCertificate(course._id, course.title)
                            }
                            className="flex-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3.5 rounded-2xl font-medium transition text-sm"
                          >
                            🎖️ Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
