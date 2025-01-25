import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

type Review = {
  rating: number;
  id: string;
};

const mockReviews: Review[] = [
  { rating: 5, id: "1" },
  { rating: 4, id: "2" },
  { rating: 3, id: "3" },
  { rating: 2, id: "4" },
  { rating: 1, id: "5" },
  { rating: 4, id: "6" },
  { rating: 5, id: "7" },
];

export default function ReviewComponent() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [currentRating, setCurrentRating] = useState(0);

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  const addReview = () => {
    if (currentRating === 0) return;
    setReviews((prev) => [
      ...prev,
      { rating: currentRating, id: crypto.randomUUID() },
    ]);
    setCurrentRating(0);
  };

  const getStarCount = (rating: number) => {
    return reviews.filter((r) => r.rating === rating).length;
  };

  const getStarPercentage = (rating: number) => {
    return reviews.length ? (getStarCount(rating) / reviews.length) * 100 : 0;
  };

  return (
    <div className="py-4">
      <h1 className="font-semibold">Reviews</h1>
      <div className="flex gap-4 mb-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              onClick={() => setCurrentRating(rating)}
              variant="ghost"
            >
              <Star
                className="w-8 h-8"
                fill={rating <= currentRating ? "gold" : "none"}
                color={rating <= currentRating ? "gold" : "gray"}
              />
            </Button>
          ))}
        </div>

        <Button onClick={addReview} variant="outline">
          Submit Review
        </Button>
      </div>

      {reviews.length > 0 && (
        <>
          <div className="mt-4">
            <p className="text-xl font-bold">Average: {averageRating} ⭐</p>
            <p className="text-sm text-muted-foreground">
              Total reviews: {reviews.length}
            </p>
          </div>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-4">
              <span className="w-12">{rating} ★</span>
              <Progress value={getStarPercentage(rating)} className="flex-1" />
              <span className="w-12 text-right">{getStarCount(rating)}</span>
            </div>
          ))}
        </>
      )}
      {!reviews.length && (
        <p className="text-muted-foreground">No reviews yet</p>
      )}
    </div>
  );
}
