import { Link } from "react-router-dom";
import useAppStore from "../store";
import RatingChip from "./RatingChip";
import { ArrowRight, Layers, Users } from "lucide-react";
import { getOwnedCourses } from "../services/courses";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@heroui/react";

function CourseSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg p-3 border border-default bg-background/50 relative">
      <Skeleton className="size-24 rounded-lg" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="w-32 h-4" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-28 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="w-18 h-5" />
          <Skeleton className="w-10 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function DashboardCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getOwnedCourses,
    staleTime: 15 * 1000 * 60, // 15 minutes
  });

  const { courses, setCourses } = useAppStore();

  const publishedCourses = useMemo(() => {
    return courses.filter((item) => item.status === "published").slice(0.4);
  }, [courses]);

  useEffect(() => {
    if (!data) return;
    setCourses(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-outfit tracking-tighter font-semibold">
          Your Courses
        </h3>
        <Link
          to="/courses"
          className="flex items-center gap-2 ring-visible rounded-lg text-accent text-sm group p-1"
        >
          View All
          <ArrowRight
            className="group-hover:translate-x-1 transition-transform"
            size={16}
          />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 md:col-span-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          : publishedCourses?.map((item, index) => (
              <div
                className="flex items-center gap-4 rounded-lg p-3 border border-default bg-background/50 relative"
                key={index}
              >
                <img
                  src={item.cover}
                  className="size-24 object-cover rounded-sm"
                />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="font-medium font-outfit truncate tracking-tight">
                    {item.name}
                  </p>
                  <span className="text-muted text-sm truncate">
                    {item.tagline}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {item.students_enrolled}
                    </span>
                    ·
                    <span className="flex items-center gap-1">
                      <Layers size={14} /> {item.lessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl text-accent font-extrabold">
                      {item.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <RatingChip
                      rating={item.rating_sum / item.rating_count}
                      className="bg-warning text-black"
                      starClassName="text-black"
                      size={14}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default DashboardCourses;
