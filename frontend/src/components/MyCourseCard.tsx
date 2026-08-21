import { Link } from "react-router-dom";
import type { Course } from "../types/course";
import { formatDuration } from "../lib/helpers";
import { Chip } from "@heroui/react";
import RatingChip from "./RatingChip";

function MyCourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="flex flex-col group ring-visible rounded-lg overflow-hidden border border-background hover:border-background-tertiary hover:shadow-sm relative"
    >
      <Chip
        variant="soft"
        className="absolute top-2 right-2 rounded-full capitalize z-10"
      >
        {course.category}
      </Chip>
      <div className="relative overflow-hidden">
        <img
          src={course.cover}
          alt={course.name}
          className="group-hover:scale-105 transition-transform duration-700 w-full aspect-video object-cover"
        />
      </div>
      <div className={`w-1/2 bg-accent h-1`} />
      <div className="flex items-center justify-between gap-1 pr-3">
        <div className="flex flex-col p-3 w-full">
          <h5 className="sm:text-xl text-lg tracking-tight font-outfit font-semibold">
            {course.name}
          </h5>
          <p className="text-muted sm:text-base text-sm truncate w-full">
            {course.tagline}
          </p>
          <p className="sm:text-sm text-xs text-muted">
            {formatDuration(course.duration)} · {course.lessons} lessons
          </p>
          <div className="flex justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {course.skills?.slice(0, 3)?.map((item, index) => (
                <Chip
                  className="rounded-full bg-accent text-white capitalize"
                  key={index}
                >
                  {item}
                </Chip>
              ))}
            </div>
            <RatingChip
              rating={course.rating_sum / course.rating_count}
              className="bg-warning border text-black border-black font-medium"
              starClassName="text-black"
              size={14}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MyCourseCard;
