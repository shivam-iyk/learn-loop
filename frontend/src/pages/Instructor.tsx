import { BookOpen, Users } from "lucide-react";
import useAppStore from "../store";
import { Avatar, Chip, Separator } from "@heroui/react";
import type { Course as CourseI } from "../types/course";
import { Link } from "react-router-dom";
import RatingChip from "../components/RatingChip";

function Course({ course }: { course: CourseI }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="flex flex-col rounded-lg overflow-hidden border relative group hover:shadow-sm hover:border-background-tertiary"
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
        <h4 className="text-lg tracking-tight font-medium">{course.name}</h4>
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
  );
}

function Instructor() {
  const { courses, instructor } = useAppStore();
  return (
    <div>
      <div className="flex flex-col py-6 gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="rounded-full size-40">
            <Avatar.Image src={instructor.avatar} />
            <Avatar.Fallback>{instructor.name[0]}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Chip className="w-fit bg-accent-soft text-accent-soft-foreground rounded-full font-huninn uppercase tracking-tight">
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
          <p className="font-quicksand">{instructor.bio}</p>
        </div>
        <Separator />
        <h4 className="text-2xl font-semibold tracking-tight">Courses</h4>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((item, index) => (
            <Course course={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Instructor;
