import { Avatar, Button, Modal } from "@heroui/react";
import useBoundStore from "../store";
import RatingStars from "./RatingStars";
import { formatDistance } from "date-fns";
import type { Review as ReviewI } from "../types/review";
import SearchBar from "./SearchBar";
import { useMemo, useState } from "react";
import CustomEmptyState from "./CustomEmptyState";
import { Search } from "lucide-react";

function Review({ review }: { review: ReviewI }) {
  return (
    <div className="flex gap-4 border border-default bg-background/50 rounded-lg p-3 w-full">
      <Avatar className="rounded-full size-10">
        <Avatar.Image src={review.user_avatar} />
        <Avatar.Fallback>{review.user_name[0]}</Avatar.Fallback>
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
        <p className="text-muted text-sm">{review.review}</p>
      </div>
    </div>
  );
}

function RecentReviews() {
  const { reviews } = useBoundStore();

  const [search, setSearch] = useState("");

  const filteredReviews = useMemo(() => {
    if (search === "") return reviews;

    return reviews.filter(
      (item) =>
        item.review.toLowerCase().includes(search.toLowerCase()) ||
        item.user_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [reviews, search]);

  return (
    <div className="bg-background/60 p-3 rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xl font-outfit font-semibold tracking-tight">
          Recent Reviews
        </h4>
        <Modal>
          {reviews.length > 3 ? (
            <Button variant="ghost" className="text-accent">
              View More
            </Button>
          ) : null}
          <Modal.Backdrop>
            <Modal.Container size="lg">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <h4 className="text-xl font-outfit font-semibold">Reviews</h4>
                  <SearchBar
                    value={search}
                    setValue={(value) => setSearch(value)}
                    inputClassName="flex-1 bg-black"
                    buttonTextClassName="hidden"
                    placeholder="Search for reviews"
                  />
                </Modal.Header>
                <Modal.Body className="min-h-[75vh]">
                  <div className="flex flex-col max-h-[75vh] gap-2">
                    {filteredReviews.length === 0 ? (
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
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {reviews
          .slice(0, 3)
          .filter((item) => item.review?.length > 0)
          .map((item, index) => (
            <Review review={item} key={index} />
          ))}
      </div>
    </div>
  );
}

export default RecentReviews;
