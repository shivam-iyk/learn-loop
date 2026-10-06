import useAppStore from "../store";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, ListChecks, Play } from "lucide-react";
import { cn } from "@heroui/styles";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Lesson } from "../types/lesson";
import { getLessons } from "../services/lesson";
import CourseContentSkeleton from "../skeletons/CourseContent";

function CourseContent({
  courseId,
  className,
}: {
  courseId?: string | number;
  className?: string;
}) {
  const { course, lessons, setLessons, progress, user } = useAppStore();

  const { data, isLoading } = useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: () => getLessons(courseId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!courseId,
  });

  useEffect(() => {
    if (!data) return;
    setLessons(data);
  }, [data]);

  if (isLoading) {
    return <CourseContentSkeleton />;
  }

  return (
    <div className={cn("bg-background/70 rounded-lg p-4 h-fit", className)}>
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Course Content
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {lessons.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <span>No Lessons found</span>
            {user.id === course.owner && (
              <Link
                to={`/create-course/${course.id}/lessons`}
                className="button button--primary w-full"
              >
                Add Lessons
              </Link>
            )}
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <Link
              to={`/course/${lesson.course}/lesson/${lesson.id}`}
              className="flex items-center justify-between gap-2 ring-visible border border-background-secondary rounded-lg p-2"
              key={index}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-2 bg-accent/50 dark:bg-accent/80 rounded-2xl text-black">
                  {lesson.type === "video" ? (
                    <Play />
                  ) : lesson.type === "quiz" ? (
                    <ListChecks />
                  ) : (
                    <FileText />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-muted">
                    {lesson.type === "quiz" ? "Quiz" : "Lesson"} {index + 1}
                  </span>
                  <h5 className="text-base truncate">{lesson.name}</h5>
                </div>
              </div>
              {index + 1 <= progress.completed && course.owner !== user.id && (
                <CheckCircle2 className="text-accent mr-2" size={20} />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseContent;
