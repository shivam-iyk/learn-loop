import { Link } from "react-router-dom";
import useBoundStore from "../store";
import RatingChip from "./RatingChip";
import { ArrowRight, Layers, Users } from "lucide-react";

function DashboardCourses() {
  const { courses } = useBoundStore();

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
        {courses.map((item, index) => (
          <div
            className="flex items-center gap-4 rounded-lg p-3 border border-default bg-background/50 relative"
            key={index}
          >
            <img src={item.cover} className="size-24 object-cover rounded-sm" />
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
