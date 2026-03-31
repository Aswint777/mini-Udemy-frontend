import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../axios";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewText?: string;
  createdAt: string;
}

interface CourseReviewProps {
  courseId: string;
  isEnrolled: boolean;
  onReviewSubmitted?: () => void;
}

const CourseReview: React.FC<CourseReviewProps> = ({
  courseId,
  isEnrolled,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}/reviews`);

      setReviews(data.reviews || []);
      setCurrentUserId(data.currentUserId || null);

      if (data.currentUserId && data.reviews) {
        const userReview = data.reviews.find(
          (r: Review) => r.user._id === data.currentUserId,
        );

        if (userReview) {
          setRating(userReview.rating);
          setReviewText(userReview.reviewText || "");
          setHasReviewed(true);
        } else {
          setRating(0);
          setReviewText("");
          setHasReviewed(false);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating (1-5 stars)");
      return;
    }

    if (!isEnrolled) {
      toast.error("You must be enrolled to review this course");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/courses/${courseId}/review`, {
        rating,
        reviewText: reviewText.trim() || undefined,
      });

      toast.success("Thank you for your review! 🎉");

      setHasReviewed(true);
      await fetchReviews();
      onReviewSubmitted?.();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const Star = ({ value }: { value: number }) => (
    <span
      className={`text-5xl cursor-pointer transition-all duration-200 ${
        value <= (hover || rating)
          ? "text-yellow-400 scale-110"
          : "text-gray-600"
      } hover:scale-125`}
      onClick={() => setRating(value)}
      onMouseEnter={() => setHover(value)}
      onMouseLeave={() => setHover(0)}
    >
      ★
    </span>
  );

  return (
    <div className="bg-gray-900 rounded-3xl p-8 mt-10 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Rate & Review This Course</h2>

      {isEnrolled && !hasReviewed ? (
        <div className="mb-10 bg-gray-950 rounded-2xl p-8 border border-gray-800">
          <p className="text-center text-gray-400 mb-6">
            How would you rate this course?
          </p>

          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star key={value} value={value} />
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this course... (optional)"
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 min-h-[130px] resize-y"
            maxLength={1000}
          />

          <div className="text-right text-xs text-gray-500 mt-1">
            {reviewText.length} / 1000
          </div>

          <button
            onClick={submitReview}
            disabled={loading || rating === 0}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 py-4 rounded-2xl font-semibold text-lg transition-all disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : isEnrolled && hasReviewed ? (
        <div className="mb-8 p-6 bg-green-900/20 border border-green-700 rounded-2xl text-center">
          <p className="text-green-400 font-medium">
            ✅ You have already reviewed this course. Thank you!
          </p>
        </div>
      ) : null}

      <div>
        <h3 className="text-xl font-semibold mb-6 flex items-center justify-between">
          Student Reviews
          <span className="text-sm font-normal text-gray-400">
            ({reviews.length})
          </span>
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-950 rounded-2xl border border-gray-800">
            <p className="text-gray-500">
              No reviews yet. Be the first to share your feedback!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-950 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{review.user.name}</p>
                      <p className="text-xs text-gray-500">
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

                  <div className="flex text-yellow-400 text-3xl">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-700">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>

                {review.reviewText && (
                  <p className="text-gray-300 leading-relaxed mt-5 text-[15px] pl-1">
                    “{review.reviewText}”
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReview;
