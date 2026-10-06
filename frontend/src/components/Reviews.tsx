import { Avatar, Button, cn, Modal } from "@heroui/react";
import useAppStore from "../store";
import { formatDistance } from "date-fns";
import RatingStars from "./RatingStars";
import type { Review as ReviewI } from "../types/review";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourseReviews } from "../services/review";
import ReviewsSkeleton from "../skeletons/Reviews";

function Review({ review }: { review: ReviewI }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="rounded-full size-7">
            <Avatar.Image src={review.user_avatar} />
            <Avatar.Fallback>{review.user_name[0]}</Avatar.Fallback>
          </Avatar>
          <div>
            <span className="font-semibold text-foreground">
              {review.user_name}
            </span>
            <div className="flex text-warning gap-1">
              <RatingStars
                stars={review.rating}
                size={12}
                subTextClassName="hidden"
              />
            </div>
          </div>
        </div>
        <span className="font-inter-tight text-xs tracking-tight text-muted">
          {formatDistance(new Date(review.created_at), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <span className="text-sm text-foreground font-light">
        {review.review}
      </span>
    </div>
  );
}

function Reviews({
  className,
  courseId,
}: {
  className?: string;
  courseId?: string;
}) {
  const { reviews, setReviews } = useAppStore();

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getCourseReviews(courseId || 0),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!courseId,
  });

  const filteredReviews = useMemo(() => {
    if (reviews.length === 0) return [];
    const sortedReviews = reviews
      .sort((a, b) => a.review.localeCompare(b.review))
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

    return sortedReviews.slice(0, 3);
  }, [reviews]);

  useEffect(() => {
    if (!data) return;
    setReviews(data);
  }, [data]);

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  return (
    <div
      className={cn(
        "bg-background/30 border border-default rounded-lg p-4 h-fit",
        className,
      )}
    >
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Ratings & Reviews
      </h4>
      <div className="flex flex-col gap-4 mt-2">
        {filteredReviews.slice(0, 2).map((item, index) => (
          <Review key={index} review={item} />
        ))}
        <div className={`pl-3 ${filteredReviews.length > 2 ? "" : "hidden"}`}>
          <Modal>
            <Button className="w-full" variant="ghost">
              Show all reviews
            </Button>
            <Modal.Backdrop>
              <Modal.Container size="lg">
                <Modal.Dialog>
                  <Modal.CloseTrigger />
                  <Modal.Body>
                    <h5 className="text-xl text-foreground font-outfit font-semibold mb-4">
                      Ratings & Reviews
                    </h5>
                    <div className="flex flex-col gap-2 h-full max-h-[75vh] overflow-y-auto">
                      {filteredReviews.map((item, index) => (
                        <Review review={item} key={index} />
                      ))}
                    </div>
                  </Modal.Body>
                  <Modal.Footer />
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
