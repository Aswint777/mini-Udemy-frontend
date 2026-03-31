import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../utility/Navbar";
import api from "../../axios";
import toast, { Toaster } from "react-hot-toast";

interface Lesson {
  title: string;
  videoFile: File | null;
}

function CreateCourse() {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: null as File | null,
    lessons: [{ title: "", videoFile: null }] as Lesson[],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (
    index: number,
    field: keyof Lesson,
    value: string | File | null,
  ) => {
    const updatedLessons = [...courseData.lessons];
    (updatedLessons[index] as any)[field] = value;

    setCourseData({ ...courseData, lessons: updatedLessons });

    if (field === "videoFile" && value instanceof File) {
      const newPreviews = [...videoPreviews];
      newPreviews[index] = URL.createObjectURL(value);
      setVideoPreviews(newPreviews);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourseData({ ...courseData, thumbnail: file });

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(null);
    }
  };

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, { title: "", videoFile: null }],
    });
    setVideoPreviews([...videoPreviews, ""]);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
    const updatedPreviews = videoPreviews.filter((_, i) => i !== index);

    setCourseData({ ...courseData, lessons: updatedLessons });
    setVideoPreviews(updatedPreviews);

    if (videoPreviews[index]) {
      URL.revokeObjectURL(videoPreviews[index]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseData.title || !courseData.description || !courseData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);

      if (courseData.thumbnail) {
        formData.append("thumbnail", courseData.thumbnail);
      }

      const lessonData = courseData.lessons.map((lesson) => ({
        title: lesson.title,
      }));
      formData.append("lessons", JSON.stringify(lessonData));

      courseData.lessons.forEach((lesson) => {
        if (lesson.videoFile) {
          formData.append("videos", lesson.videoFile);
        }
      });

      const { data } = await api.post("/create-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course created successfully! 🎉");

      setTimeout(() => {
        navigate("/instructor-dashboard");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto p-6 bg-white mt-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-xl"
            />
            {thumbnailPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full max-w-md h-52 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Complete React.js Masterclass"
              value={courseData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your course..."
              value={courseData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="2999"
              value={courseData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lessons</h2>
              <button
                type="button"
                onClick={addLesson}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Add Lesson
              </button>
            </div>

            {courseData.lessons.map((lesson, index) => (
              <div
                key={index}
                className="border border-gray-200 p-6 rounded-2xl mb-6 bg-gray-50"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-lg">Lesson {index + 1}</h3>
                  {courseData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Lesson
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={`Lesson ${index + 1} Title`}
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonChange(index, "title", e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-4"
                />

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleLessonChange(
                      index,
                      "videoFile",
                      e.target.files?.[0] || null,
                    )
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl"
                />

                {videoPreviews[index] && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                    <video
                      src={videoPreviews[index]}
                      controls
                      className="w-full rounded-xl border"
                      style={{ maxHeight: "320px" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 
                       text-white py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
