import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import api from "../axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../utility/Navbar";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  lessons: any[];
  createdAt: string;
  averageRating: number;
  totalReviews: number;
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "title";

function AllCourses() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.courses || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
  }, [user]);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term),
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [courses, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-details/${courseId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Courses</h1>
          <p className="text-gray-600 mt-1">Browse our courses with ratings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by course title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500 text-base"
            />
          </div>

          <div className="w-full md:w-72">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500 text-base"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Title A - Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading courses...</p>
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow text-center">
            <p className="text-2xl text-gray-600">No courses found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">
                          No Thumbnail
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-xl line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {course.description}
                    </p>

                    {course.averageRating > 0 ? (
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(course.averageRating)}
                        <span className="text-sm font-medium text-gray-700">
                          {course.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({course.totalReviews}{" "}
                          {course.totalReviews === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                        No ratings yet
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{course.price}
                      </div>
                      <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {course.lessons?.length || 0} Lessons
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12"></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllCourses;
