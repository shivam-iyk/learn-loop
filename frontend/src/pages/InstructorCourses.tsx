import { useEffect } from "react";
import useAppStore from "../store";
import { Link } from "react-router-dom";
import { Chip } from "@heroui/react";
import RatingChip from "../components/RatingChip";
import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "../services/courses";
import InstructorCoursesSkeleton from "../skeletons/InstructorCourses";

function InstructorCourses({
  instructorId,
}: {
  instructorId?: string | number;
}) {
  const { courses, setCourses } = useAppStore();

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-courses", instructorId],
    queryFn: () => getInstructorCourses(instructorId!),
    enabled: !!instructorId,
  });

  useEffect(() => {
    if (!data) return;
    setCourses(data);
  }, [data]);

  if (isLoading) {
    return <InstructorCoursesSkeleton />;
  }

  return (
    <>
      <h4 className="text-2xl font-semibold tracking-tight">Courses</h4>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {courses.map((course, index) => (
          <Link
            to={`/course/${course.id}`}
            className="flex flex-col rounded-lg overflow-hidden border relative group hover:shadow-sm hover:border-background-tertiary"
            key={index}
          >
            <Chip
              variant="soft"
              className="absolute top-2 right-2 capitalize rounded-full font-huninn z-10"
            >
              {course.category}
            </Chip>
            <img
              src={course.cover}
              alt={course.name}
              className="w-full object-cover rounded-lg aspect-video group-hover:scale-105 transition-transform duration-100"
            />
            <div className="p-3">
              <h4 className="text-lg tracking-tight font-medium">
                {course.name}
              </h4>
              <p className="text-muted text-sm truncate">{course.tagline}</p>
              <p className="text-xs text-muted">{course.lessons} lessons</p>
              <div className="flex justify-between">
                <span className="text-accent text-xl font-semibold">
                  {course.price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </span>
                <RatingChip
                  rating={course.rating_sum / course.rating_count}
                  className="text-black bg-warning"
                  starClassName="text-black"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default InstructorCourses;
