import { Chip } from "@heroui/react";
import type { Course } from "../types/course";
import { Link } from "react-router-dom";
import RatingChip from "./RatingChip";

function ExploreCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="flex gap-2 ring-visible border border-background hover:border-background-tertiary hover:shadow-sm w-full rounded-lg overflow-hidden relative max-sm:flex-col"
    >
      <img
        src={course.cover}
        alt={course.name}
        className="object-cover object-center aspect-video rounded-l-lg lg:w-1/3 sm:w-1/2 w-full"
      />
      <div className="flex flex-col justify-between gap-2 sm:p-4 max-sm:px-3 max-sm:py-2">
        <div className="flex flex-col gap-2">
          <h5 className="sm:text-2xl text-lg tracking-tight font-outfit font-semibold truncate">
            {course.name}
          </h5>
          <p className="sm:text-base text-sm text-muted">{course.tagline}</p>
          <p className="sm:text-sm text-xs text-muted">
            {course.lessons} lessons
          </p>
          <div className="flex gap-2">
            {course?.skills?.map((item, index) => (
              <Chip
                className="bg-accent text-white rounded-full capitalize"
                key={index}
              >
                {item}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <RatingChip
              rating={course.rating_sum / course.rating_count}
              className="bg-warning text-sm text-black"
              starClassName="text-black"
              size={14}
            />
            {course.category.length > 0 ? (
              <Chip className="border bg-transparent rounded-full capitalize">
                {course.category}
              </Chip>
            ) : null}
          </div>
        </div>
        <h4 className="sm:text-2xl text-xl font-bold text-accent">
          {course.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          })}
        </h4>
      </div>
    </Link>
  );
}

export default ExploreCard;
