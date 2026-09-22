import { Avatar, Button, Modal, Skeleton } from "@heroui/react";
import useAppStore from "../store";
import RatingStars from "./RatingStars";
import { formatDistance } from "date-fns";
import type { Review as ReviewI } from "../types/review";
// import SearchBar from "./SearchBar";
import { useEffect, useMemo, useState } from "react";
import CustomEmptyState from "./CustomEmptyState";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInstructorReviews } from "../services/review";

function Review({ review }: { review: ReviewI }) {
  return (
    <div className="flex gap-4 border border-default bg-background/50 rounded-lg p-3 w-full">
      <Avatar className="rounded-full size-10">
        <Avatar.Image src={review.user_avatar} />
        <Avatar.Fallback>{review.user_name?.[0]}</Avatar.Fallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h6 className="font-medium tracking-tight font-outfit text-foreground">
                {review.user_name}
              </h6>
              ·<p className="text-sm italic text-muted">{review.course_name}</p>
            </div>
            <RatingStars stars={review.rating} subTextClassName="hidden" />
          </div>
          <span className="text-muted text-xs">
            {formatDistance(new Date(review.created_at), new Date(), {
              addSuffix: true,
            })?.replace("about ", "")}
          </span>
        </div>
        <p className="text-muted text-sm">{review?.review}</p>
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex gap-4 border border-default bg-background/50 rounded-lg p-3 w-full">
      <Skeleton className="rounded-full size-10" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-24 h-5 mt-2" />
          </div>
          <Skeleton className="w-20 h-2 self-center" />
        </div>
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  );
}

function RecentReviews() {
  const { isLoading, data } = useQuery({
    queryKey: ["instructor-reviews"],
    queryFn: getInstructorReviews,
    staleTime: 15 * 1000 * 60, // 15 minutes
  });

  const { reviews, setReviews } = useAppStore();

  const [search, setSearch] = useState("");

  const filteredReviews = useMemo(() => {
    if (search === "") return reviews;

    return reviews.filter(
      (item) =>
        item?.review.toLowerCase().includes(search.toLowerCase()) ||
        item?.user_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [reviews, search]);

  useEffect(() => {
    if (!data) return;
    setReviews(data);
  }, [data]);

  return (
    <div className="bg-background p-3 rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xl font-outfit font-semibold tracking-tight">
          Recent Reviews
        </h4>
        {reviews?.length > 3 && (
          <Modal>
            <Button variant="ghost" className="text-accent">
              View More
            </Button>
            <Modal.Backdrop>
              <Modal.Container size="lg">
                <Modal.Dialog>
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <h4 className="text-xl font-outfit font-semibold">
                      Reviews
                    </h4>
                    {/* TODO: Implement the search-bar functionality
                     <SearchBar
                    value={search}
                    setValue={(value) => setSearch(value)}
                    inputClassName="flex-1 bg-black"
                    buttonTextClassName="hidden"
                    placeholder="Search for reviews"
                  /> */}
                  </Modal.Header>
                  <Modal.Body className="min-h-[75vh]">
                    <div className="flex flex-col max-h-[75vh] gap-2">
                      {filteredReviews?.length === 0 ? (
                        <CustomEmptyState
                          title="No reviews found"
                          description={
                            search.length > 0 ? "Try refining your search" : ""
                          }
                          icon={Search}
                          actions={
                            search.length > 0 ? (
                              <Button
                                variant="outline"
                                onClick={() => setSearch("")}
                              >
                                Clear Search
                              </Button>
                            ) : null
                          }
                          containerClassName="min-h-[50vh]"
                        />
                      ) : (
                        filteredReviews.map((item, index) => (
                          <Review review={item} key={index} />
                        ))
                      )}
                    </div>
                  </Modal.Body>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <ReviewSkeleton key={index} />)
          : reviews
              .sort((a, b) => a?.review.localeCompare(b?.review || ""))
              .slice(0, 3)
              .map((item, index) => <Review review={item} key={index} />)}
      </div>
    </div>
  );
}

export default RecentReviews;
