import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../utility/Navbar";
import api from "../axios";
import toast, { Toaster } from "react-hot-toast";
import { useAppSelector } from "../redux/hooks";

interface Lesson {
  _id: string;
  title: string;
  videoUrl?: string;
}

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  reviewText?: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  lessons: Lesson[];
  instructor?: { name: string };
  averageRating: number;
  totalReviews: number;
}

function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);

        setCourse(data.course);
        setReviews(data.reviews || []);

        if (user) {
          const enrollRes = await api.get(`/enrollments/check/${courseId}`);
          setIsEnrolled(enrollRes.data.isEnrolled);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    if (user.role === "instructor") {
      toast.error("Instructors cannot enroll in courses");
      return;
    }

    try {
      await api.post("/enrollments", { courseId });
      toast.success("Enrollment successful!");
      setIsEnrolled(true);
      navigate(`/enrollment-success`, {
        state: { course: course },
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  const handleGoToCourse = () => {
    navigate(`/my-learning/${courseId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400 text-xl">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/all-courses")}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          ← Back to All Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="relative">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    className="w-full aspect-video object-cover"
                    alt={course.title}
                  />
                )}
              </div>

              <div className="p-10">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

                {course.averageRating > 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      {renderStars(course.averageRating)}
                      <span className="text-2xl font-semibold text-gray-800">
                        {course.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({course.totalReviews}{" "}
                      {course.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}

                <p className="text-lg text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <div className="bg-white rounded-3xl shadow divide-y">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson._id} className="p-6 flex items-center gap-5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg">{lesson.title}</p>
                    </div>
                    {index === 0 && (
                      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                        Free Preview
                      </span>
                    )}
                    {index > 0 && (
                      <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-sm">
                        Locked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                Student Reviews
                <span className="text-gray-500 text-lg font-normal">
                  ({reviews.length})
                </span>
              </h2>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No reviews yet. Be the first to review after enrolling!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white rounded-3xl p-8 shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">
                              {review.user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex text-2xl text-yellow-400">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>

                      {review.reviewText && (
                        <p className="text-gray-700 leading-relaxed text-[15.5px] pl-1">
                          "{review.reviewText}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
              <div className="text-5xl font-bold text-green-600 mb-1">
                ₹{course.price}
              </div>
              <p className="text-gray-500 mb-8">
                One-time payment • Lifetime access
              </p>

              {user?.role === "instructor" ? (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 py-4 rounded-2xl font-semibold cursor-not-allowed"
                >
                  Instructors cannot enroll
                </button>
              ) : isEnrolled ? (
                <button
                  onClick={handleGoToCourse}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl text-lg transition-all active:scale-[0.98]"
                >
                  Continue Learning →
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl text-lg transition-all active:scale-[0.98]"
                >
                  Enroll Now - ₹{course.price}
                </button>
              )}

              <div className="mt-8 space-y-4 text-sm">
                {[
                  "Full access to all lessons",
                  "Lifetime access",
                  "Learn at your own pace",
                  "Certificate on completion",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
