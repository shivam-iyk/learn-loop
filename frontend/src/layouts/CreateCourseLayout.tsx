import { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  "Start with course details",
  "Add Lessons",
  "Publish your Course",
];

function CreateCourseLayout() {
  const location = useLocation();

  const step = location.pathname.endsWith("/publish")
    ? 3
    : location.pathname.includes("/lessons")
      ? 2
      : 1;

  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <h3 className="tracking-tighter sm:text-3xl text-2xl font-outfit font-bold">
          Create Course
        </h3>
        <p className="text-muted">
          Set up your course, add lessons, quizzes, and publish
        </p>
      </div>
      <div className="flex max-md:flex-col gap-8">
        <div className="flex md:flex-col max-md:justify-between max-md:items-center md:gap-4 md:sticky top-20 h-fit">
          {steps.map((item, index) => (
            <Fragment key={index}>
              <div className="flex flex-col text-left md:w-full">
                <span
                  className={`font-huninn uppercase ${step >= index + 1 ? "text-accent" : "text-muted"} text-xl`}
                >
                  Step {index + 1}
                </span>
                <p className="text-muted max-sm:hidden whitespace-nowrap">
                  {item}
                </p>
              </div>
              <ArrowRight
                size={20}
                className={`sm:hidden last:hidden ${step > index ? "text-accent" : "text-muted"}`}
              />
            </Fragment>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default CreateCourseLayout;
