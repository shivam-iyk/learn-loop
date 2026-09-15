import type { Course as CourseI } from "../types/course";
import { Chip } from "@heroui/react";
import { Link } from "react-router-dom";
import RatingChip from "./RatingChip";

function HomeCard({ course }: { course: CourseI }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="ring-visible-offset rounded-xl"
    >
      <div className="border border-background hover:border-background-tertiary rounded-xl overflow-hidden relative group w-full">
        <Chip
          variant="soft"
          className="absolute top-2 right-2 rounded-full z-10 capitalize font-poppins"
        >
          {course.category}
        </Chip>
        <div className="overflow-hidden rounded-b-xl w-full">
          <img
            src={course.cover}
            alt={course.name}
            className="w-full aspect-video object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between p-4 gap-2 w-full">
          <div className="flex flex-col w-[80%]">
            <h5 className="md:text-xl text-lg tracking-tight font-medium font-outfit">
              {course.name}
            </h5>
            <p className="text-muted md:text-base text-sm truncate">
              {course.tagline}
            </p>
            <span className="text-xs text-muted">{course.lessons} lessons</span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <RatingChip
              rating={course.rating_sum / course.rating_count}
              className="bg-foreground text-background dark:font-medium"
              starClassName="text-warning"
              fill="currentColor"
              size={14}
            />
            {course?.price > 0 && (
              <h5 className="text-accent text-right font-semibold text-xl">
                {course.price.toLocaleString("en-IN", {
                  currency: "INR",
                  style: "currency",
                  maximumFractionDigits: 0,
                })}
              </h5>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HomeCard;
