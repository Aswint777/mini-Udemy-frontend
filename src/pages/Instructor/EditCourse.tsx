import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../utility/Navbar";
import axios from "axios";
import api from "../../axios";
import toast from "react-hot-toast";

interface Lesson {
  _id?: string;
  title: string;
  videoUrl?: string;
  videoFile?: File | null;
}

interface CourseData {
  title: string;
  description: string;
  price: string;
  thumbnail: File | null;
  lessons: Lesson[];
}

function EditCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    price: "",
    thumbnail: null,
    lessons: [],
  });

  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/instructor/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const course = data.course;

        setCourseData({
          title: course.title,
          description: course.description,
          price: course.price.toString(),
          thumbnail: null,
          lessons: course.lessons.map((lesson: any) => ({
            _id: lesson._id,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            videoFile: null,
          })),
        });

        setExistingThumbnail(course.thumbnail || null);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        alert("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourseData({ ...courseData, thumbnail: file });

    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleLessonTitleChange = (index: number, value: string) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index].title = value;
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  const handleLessonVideoChange = (index: number, file: File | null) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index].videoFile = file;
    setCourseData({ ...courseData, lessons: updatedLessons });

    if (file) {
      const newPreviews = [...videoPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setVideoPreviews(newPreviews);
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

    if (videoPreviews[index]) URL.revokeObjectURL(videoPreviews[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataObj = new FormData();

      formDataObj.append("title", courseData.title);
      formDataObj.append("description", courseData.description);
      formDataObj.append("price", courseData.price);

      if (courseData.thumbnail) {
        formDataObj.append("thumbnail", courseData.thumbnail);
      }

      const lessonData = courseData.lessons.map((lesson) => ({
        title: lesson.title,
        _id: lesson._id,
      }));

      formDataObj.append("lessons", JSON.stringify(lessonData));

      courseData.lessons.forEach((lesson, index) => {
        if (lesson.videoFile) {
          formDataObj.append("videos", lesson.videoFile);
        }
      });

      const token = localStorage.getItem("token");

      await api.put(`/instructor/courses/${courseId}`, formDataObj, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Course updated successfully! 🎉");
      navigate("/instructor-dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading course details...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 bg-white mt-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Course</h1>
          <button
            onClick={() => navigate("/instructor-dashboard")}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full border px-4 py-2 rounded-lg"
            />

            {(thumbnailPreview || existingThumbnail) && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">
                  Current / New Preview:
                </p>
                <img
                  src={thumbnailPreview || existingThumbnail || ""}
                  alt="Thumbnail"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={courseData.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Course Description"
            value={courseData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            name="price"
            placeholder="Course Price"
            value={courseData.price}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <div>
            <h2 className="text-lg font-semibold mb-3">Lessons</h2>

            {courseData.lessons.map((lesson, index) => (
              <div
                key={index}
                className="border p-5 rounded-xl mb-4 bg-gray-50"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">Lesson {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) =>
                    handleLessonTitleChange(index, e.target.value)
                  }
                  placeholder="Lesson Title"
                  required
                  className="w-full border px-3 py-2 rounded mb-3"
                />

                {lesson.videoUrl && !lesson.videoFile && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Current Video:</p>
                    <video
                      src={lesson.videoUrl}
                      controls
                      className="w-full rounded border"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleLessonVideoChange(index, e.target.files?.[0] || null)
                  }
                  className="w-full border px-3 py-2 rounded mb-3"
                />

                {videoPreviews[index] && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      New Video Preview:
                    </p>
                    <video
                      src={videoPreviews[index]}
                      controls
                      className="w-full rounded border"
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addLesson}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
            >
              + Add New Lesson
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium disabled:bg-gray-400"
          >
            {saving ? "Updating Course..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
