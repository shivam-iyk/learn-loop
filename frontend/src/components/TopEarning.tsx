import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTopEarningCourses } from "../services/courses";
import { Skeleton } from "@heroui/react";

interface CourseI {
  id: number;
  cover: string;
  name: string;
  tagline: string;
  price: number;
}

function CourseSkeleton() {
  return (
    <div className="flex items-center bg-background rounded-lg gap-3 p-1">
      <Skeleton className="size-24" />
      <div className="flex flex-col justify-around gap-4">
        <div>
          <Skeleton className="w-30 h-4" />
          <Skeleton className="w-24 h-3 mt-1" />
        </div>
        <Skeleton className="w-16 h-6 " />
      </div>
    </div>
  );
}

function TopEarning() {
  const { data, isLoading } = useQuery<CourseI[]>({
    queryKey: ["top-earning-courses"],
    queryFn: getTopEarningCourses,
    staleTime: 15 * 1000 * 60, // 15 minutes
  });

  return (
    <div className="w-full">
      <h4 className="text-xl font-outfit font-semibold tracking-tight">
        Top Earning
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          : data?.map((item, index) => (
              <Link
                to={`/course/${item.id}`}
                className="flex items-center bg-background rounded-lg gap-3 p-1"
                key={index}
              >
                <img
                  src={item.cover}
                  className="size-24 object-cover rounded-sm"
                />
                <div className="flex flex-col justify-between gap-2 p-2 pl-0">
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-medium font-outfit tracking-tight truncate">
                      {item.name}
                    </p>
                    <span className="text-xs text-muted truncate">
                      {item.tagline}
                    </span>
                  </div>
                  <span className="text-accent font-semibold text-xl">
                    {item.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default TopEarning;
