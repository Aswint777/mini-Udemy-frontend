import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../axios";
import Navbar from "../../utility/Navbar";
import CourseReview from "./CourseReview";

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
}

interface Enrollment {
  _id: string;
  course: Course;
  progress: number;
  completedLessons: string[];
  lastAccessedAt: string;
}

function MyLearning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLearning = async () => {
      try {
        const { data } = await api.get(`/my-learning/${courseId}`);
        setEnrollment(data.enrollment);

        if (data.enrollment) {
          const completedIds = data.enrollment.completedLessons || [];
          const firstUncompleted = data.enrollment.course.lessons.findIndex(
            (lesson: Lesson) => !completedIds.includes(lesson._id),
          );
          setCurrentLessonIndex(firstUncompleted >= 0 ? firstUncompleted : 0);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load course");
        navigate("/student-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMyLearning();
  }, [courseId, navigate]);

  const currentLesson = enrollment?.course.lessons[currentLessonIndex];

  const markLessonAsCompleted = async (lessonId: string) => {
    try {
      await api.post(`/my-learning/${courseId}/complete-lesson`, { lessonId });

      const { data } = await api.get(`/my-learning/${courseId}`);
      setEnrollment(data.enrollment);

      toast.success("Lesson marked as completed");

      if (currentLessonIndex < (enrollment?.course.lessons.length || 0) - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading your course...</p>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="text-center py-20">
        Course not found or access denied.
      </div>
    );
  }

  const course = enrollment.course;
  const progressPercentage = enrollment.progress;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <button
              onClick={() => navigate("/student-dashboard")}
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-400 mt-1">
              {course.lessons.length} lessons
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Your Progress</div>
            <div className="text-4xl font-bold text-green-500">
              {progressPercentage}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
              {currentLesson?.videoUrl ? (
                <video
                  key={currentLesson._id}
                  src={currentLesson.videoUrl}
                  controls
                  autoPlay={false}
                  className="w-full aspect-video"
                  onEnded={() => markLessonAsCompleted(currentLesson._id)}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-900">
                  <p className="text-gray-500">Video not available</p>
                </div>
              )}
            </div>

            <div className="mt-6 bg-gray-900 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-blue-400 text-sm">
                    LESSON {currentLessonIndex + 1} OF {course.lessons.length}
                  </span>
                  <h2 className="text-2xl font-semibold mt-2">
                    {currentLesson?.title}
                  </h2>
                </div>

                <button
                  onClick={() => markLessonAsCompleted(currentLesson!._id)}
                  disabled={!currentLesson}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-3xl p-6 sticky top-8">
              <h3 className="font-semibold text-lg mb-5">Course Content</h3>

              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = enrollment.completedLessons.includes(
                    lesson._id,
                  );
                  const isActive = index === currentLessonIndex;

                  return (
                    <div
                      key={lesson._id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium
                        ${isCompleted ? "bg-green-500 text-white" : "bg-gray-700"}`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <p
                          className={`font-medium ${isActive ? "text-white" : ""}`}
                        >
                          {lesson.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <CourseReview
          courseId={courseId!}
          isEnrolled={true}
          onReviewSubmitted={() => {
            console.log("Review submitted successfully");
          }}
        />
      </div>
    </div>
  );
}

export default MyLearning;
