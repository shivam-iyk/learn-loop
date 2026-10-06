import useAppStore from "../store";
import { Chip, Skeleton } from "@heroui/react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import type { ReactNode } from "react";

function CourseDetails({
  children,
  isLoading = false,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) {
  const { course } = useAppStore();

  if (isLoading) {
    return (
      <div className="h-80 w-full flex flex-col justify-end gap-4 py-6">
        <div className="absolute top-0 left-0 h-80 w-full bg-background/80" />
        <div className="space-y-2">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="w-80 h-5" />
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <img
        src={course.cover}
        className="absolute top-0 left-0 w-full h-80 object-cover"
      />
      <div
        className={`${course.cover ? "bg-linear-to-b from-black/20 to-black/80" : "bg-background"} absolute top-0 left-0 w-full h-80`}
      >
        <div className="flex justify-between max-w-7xl pr-2 mx-auto h-full">
          <div className="flex flex-col gap-2 justify-end p-6 flex-1">
            <Chip
              variant="soft"
              className="capitalize rounded-full self-start font-poppins"
            >
              {course.category}
            </Chip>
            <div>
              <h1 className="text-3xl tracking-tight font-bold font-outfit text-background dark:text-foreground">
                {course.name}
              </h1>
              <p className="text-background-secondary/80 dark:text-foreground/80 text-base">
                {course.tagline}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {course.skills?.map((item, index) => (
                <Chip
                  className="bg-accent capitalize rounded-full text-white"
                  key={index}
                >
                  {item}
                </Chip>
              ))}
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap flex-wrap text-background-secondary/60 dark:text-foreground text-sm">
              <RatingStars
                stars={course.rating_sum / course.rating_count}
                subText={"rated"}
                subTextClassName="text-background-secondary/60 dark:text-foreground"
              />
              <span>·</span>
              <div className="flex items-center gap-1">
                <Users size={16} />{" "}
                {course.students_enrolled.toLocaleString("en-IN", {
                  style: "decimal",
                })}{" "}
                students
              </div>
              <span>·</span>
              {course?.owner_name && (
                <div>
                  created by{" "}
                  <Link
                    to={`/instructor/${course.owner}`}
                    className="text-white font-semibold hover:underline ring-visible px-1 rounded underline-offset-2"
                  >
                    {course?.owner_name}
                  </Link>
                </div>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
