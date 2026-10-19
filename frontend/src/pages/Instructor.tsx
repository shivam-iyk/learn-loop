import { BookOpen, ShieldAlert, Users } from "lucide-react";
import useAppStore from "../store";
import { Avatar, Chip, Separator } from "@heroui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInstructor } from "../services/user";
import { useEffect } from "react";
import InstructorSkeleton from "../skeletons/Instructor";
import InstructorCourses from "./InstructorCourses";
import { useParsedQueryError } from "../hooks/error";
import CustomEmptyState from "../components/CustomEmptyState";

function Instructor() {
  const { instructorId } = useParams();
  const { instructor, setInstructor } = useAppStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["instructor", instructorId],
    queryFn: () => getInstructor(instructorId || 0),
    staleTime: 15 * 60 * 1000,
  });

  const parsedError = useParsedQueryError(error);

  useEffect(() => {
    if (!data) return;
    setInstructor(data);
  }, [data]);

  if (isError && !isLoading) {
    return (
      <CustomEmptyState
        icon={ShieldAlert}
        title={parsedError?.message || "Something went wrong"}
        description={parsedError?.description || "Please try again later"}
        containerClassName="min-h-[70vh]"
      />
    );
  }

  return (
    <div className="flex flex-col py-6 gap-6">
      {isLoading ? (
        <InstructorSkeleton />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <Avatar className="rounded-full size-40">
              <Avatar.Image src={instructor.avatar || "/avatar-big.png"} />
              <Avatar.Fallback>{instructor.name[0]}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Chip className="w-fit text-accent-soft-foreground rounded-full font-huninn uppercase tracking-tight">
                Instructor
              </Chip>
              <h3 className="text-3xl tracking-tighter font-bold">
                {instructor.name}
              </h3>
              <div className="flex gap-4 text-muted">
                <span className="flex items-center gap-2">
                  <Users />
                  {instructor.students} students
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen /> {instructor.courses} courses
                </span>
              </div>
              <div className="flex items-center mt-1 gap-2">
                {instructor.skills.map((skill, index) => (
                  <Chip
                    className="capitalize bg-accent text-white rounded-full"
                    key={index}
                  >
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-2xl font-semibold tracking-tight">About</h4>
            <p className="font-quicksand">
              {instructor.bio || "Nothing here yet"}
            </p>
          </div>
        </>
      )}
      <Separator />
      <InstructorCourses instructorId={instructorId} />
    </div>
  );
}

export default Instructor;
