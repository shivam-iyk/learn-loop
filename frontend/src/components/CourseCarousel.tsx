import { Button, Chip } from "@heroui/react";
import useBoundStore from "../store";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "../types/course";
import RatingChip from "./RatingChip";

function Slide({
  course,
  isSuggested,
}: {
  course: Course;
  isSuggested?: boolean;
}) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group focus-visible:outline-none w-full"
    >
      <div className="relative overflow-hidden w-full rounded-xl aspect-video">
        <img
          src={course.cover}
          alt={course.name}
          className="h-full object-cover rounded-xl aspect-video group-hover:scale-105 group-focus-visible:scale-105 transition-transform duration-300 text-xs text-muted"
        />
        <div className="absolute bottom-0 w-full bg-linear-to-b from-transparent via-black/50 to-black/80 h-full group-hover:opacity-100 group-focus-visible:opacity-100 opacity-0 transition-opacity duration-300 text-white flex flex-col items-center justify-center gap-2 z-10">
          <Play className="sm:size-16 size-8" />
          <h3 className="sm:text-xl text-base font-poppins">
            {isSuggested ? "Start Learning" : "Continue Learning"}
          </h3>
        </div>
        <div className="bg-linear-to-b from-transparent via-black/50 to-black/80 absolute bottom-0 p-4 w-full rounded-b-xl transition-all">
          <h3 className="lg:text-2xl md:text-xl text-lg font-outfit text-background dark:text-foreground truncate">
            {course.name}
          </h3>
          <div className="flex justify-between items-center">
            <p className="md:text-base text-sm text-background-tertiary/60 dark:text-muted truncate">
              {course.tagline}
            </p>
            <RatingChip
              rating={course.rating_sum / course.rating_count}
              className="bg-warning font-poppins font-medium text-black"
              size={12}
              starClassName="text-black"
            />
          </div>
        </div>
        <Chip
          variant="soft"
          className="absolute top-2 right-2 capitalize rounded-full font-poppins"
        >
          {course.category}
        </Chip>
      </div>
    </Link>
  );
}

function CourseCarousel() {
  const { recentCourses, suggestedCourses } = useBoundStore();
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-3 min-h-10">
        <h3 className="uppercase text-lg text-muted font-huninn">
          Continue Learning
        </h3>
        <div className="embla__controls">
          <div className="embla__buttons">
            {emblaApi?.canScrollPrev && (
              <Button
                variant="outline"
                onClick={() => emblaApi?.scrollPrev()}
                isIconOnly
              >
                <ChevronLeft />
              </Button>
            )}
            {emblaApi?.canScrollNext && (
              <Button
                variant="outline"
                onClick={() => emblaApi?.scrollNext()}
                isIconOnly
              >
                <ChevronRight />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="embla">
        <div className="embla__viewport relative" ref={emblaRef}>
          <div className="embla__container">
            {recentCourses?.length > 0
              ? recentCourses.map((course, index) => (
                  <div className="embla__slide" key={index}>
                    <div className="embla__slide__number">
                      <Slide course={course} />
                    </div>
                  </div>
                ))
              : suggestedCourses.map((course, index) => (
                  <div className="embla__slide" key={index}>
                    <div className="embla__slide__number">
                      <Slide course={course} isSuggested />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCarousel;
