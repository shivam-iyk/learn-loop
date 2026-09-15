import useAppStore from "../store";
import { Chip } from "@heroui/react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import type { ReactNode } from "react";

function CourseDetails({ children }: { children: ReactNode }) {
  const { course } = useAppStore();

  return (
    <div className="h-80 w-full">
      <img
        src={course.cover}
        className="absolute top-0 left-0 w-full h-80 object-cover"
      />
      <div className="bg-linear-to-b from-black/20 to-black/80 absolute top-0 left-0 w-full h-80">
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
              <div>
                created by{" "}
                <Link
                  to={`/instructor/${course.owner}`}
                  className="text-white font-semibold hover:underline ring-visible px-1 rounded underline-offset-2"
                >
                  {/* {course.owner_name} */}
                </Link>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
