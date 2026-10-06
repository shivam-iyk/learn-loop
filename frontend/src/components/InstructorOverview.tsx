import { Avatar, Chip } from "@heroui/react";
import useAppStore from "../store";
import { BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInstructor } from "../services/user";
import InstructorOverviewSkeleton from "../skeletons/InstructorOverview";
import { useEffect } from "react";
import CustomEmptyState from "./CustomEmptyState";

function InstructorOverview() {
  const { instructor, course, setInstructor } = useAppStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["instructor", course.owner],
    queryFn: () => getInstructor(course.owner),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!course.owner,
  });

  useEffect(() => {
    if (!data) return;
    setInstructor(data);
  }, [data]);

  if (isLoading) {
    return <InstructorOverviewSkeleton />;
  }

  if (isError && !isLoading) {
    return (
      <div className="bg-background/50">
        <CustomEmptyState
          title="Something went wrong"
          description={error?.message || "Please try again later!"}
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-background/50 rounded-lg">
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Instructor
      </h4>
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="flex items-center gap-4">
          <Avatar className="rounded-full size-24">
            <Avatar.Image src={instructor.avatar || "/avatar-small.png"} />
            <Avatar.Fallback>{instructor.name}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col justify-between gap-1">
            <Link
              to={`/instructor/${instructor.id}`}
              className="ring-visible p-1 rounded"
            >
              <h5 className="text-xl text-accent tracking-tight font-semibold">
                {instructor.name}
              </h5>
            </Link>
            <div className="text-muted">
              <div className="flex items-center gap-2">
                <Users size={16} />{" "}
                {instructor.students.toLocaleString("en-IN", {
                  style: "decimal",
                })}{" "}
                students
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} /> {instructor.courses} courses
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {instructor.skills.map((item, index) => (
            <Chip
              className="capitalize rounded-full bg-accent text-white"
              key={index}
            >
              {item}
            </Chip>
          ))}
        </div>
        <p className="text-foreground text-justify font-quicksand px-2">
          {instructor.bio || "Nothing here yet"}
        </p>
      </div>
    </div>
  );
}

export default InstructorOverview;
