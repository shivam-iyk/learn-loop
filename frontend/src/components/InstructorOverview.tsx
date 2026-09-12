import { Avatar, Chip } from "@heroui/react";
import useAppStore from "../store";
import { BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

function InstructorOverview() {
  const { instructor } = useAppStore();

  return (
    <div className="p-4 bg-background/50 rounded-lg">
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Instructor
      </h4>
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="flex items-center gap-4">
          <Avatar className="rounded-full size-24">
            <Avatar.Image src={instructor.avatar} />
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
          {instructor.bio}
        </p>
      </div>
    </div>
  );
}

export default InstructorOverview;
