import useBoundStore from "../store";
import { CheckCircle, CreditCard, Shield } from "lucide-react";
import { Button, cn } from "@heroui/react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

function CourseStatus({
  courseId,
  className,
}: {
  courseId?: string;
  className?: string;
}) {
  const { course, enrolledCourses, progress, user } = useBoundStore();

  const benefits = [
    {
      icon: CheckCircle,
      text: "Lifetime Access",
    },
    {
      icon: Shield,
      text: "Secured Payments",
    },
    {
      icon: CreditCard,
      text: "One Time Payment",
    },
  ];

  const isEnrolled = useMemo(() => {
    const id = parseInt(courseId || "0");
    if (!id) return false;
    return enrolledCourses.some((item) => item.id === id);
  }, [courseId]);

  if (course.owner === user.id) {
    return null;
  }

  return (
    <div
      className={cn("py-2 pr-2 flex flex-col justify-end h-full", className)}
    >
      <div className="flex flex-col gap-2 bg-background p-4 rounded-lg w-80">
        <h5 className="text-xl tracking-tight font-semibold font-outfit">
          {isEnrolled ? "Enrolled" : "Enroll into course"}
        </h5>
        {isEnrolled ? (
          <div className="flex flex-col gap-2">
            <p className="text-muted text-sm">
              {progress.completed === 0 ? "Start Learning" : "Your Progress"}
            </p>
            <div className="bg-background-secondary rounded-xl overflow-hidden relative">
              <div
                className="h-2 bg-accent"
                style={{
                  width: `${(progress.completed / progress.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted">
              {progress.completed} of {progress.total} lessons completed
            </p>
          </div>
        ) : (
          <h3 className="text-3xl tracking-tighter text-accent font-bold">
            {course.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </h3>
        )}
        {isEnrolled ? null : (
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {benefits.map((item, index) => (
              <li className="flex items-center gap-2" key={index}>
                <item.icon size={16} className="text-accent" /> {item.text}
              </li>
            ))}
          </ul>
        )}

        {isEnrolled ? (
          <Link
            to={`/course/${course.id}/lesson/${progress.completed + 1}`}
            className="button w-full bg-linear-to-b from-accent/50 to-accent bg-transparent mt-3 text-white"
          >
            Continue
          </Link>
        ) : (
          <Button className="w-full bg-linear-to-b from-accent/50 to-accent bg-transparent mt-3">
            Enroll
          </Button>
        )}
      </div>
    </div>
  );
}

export default CourseStatus;
