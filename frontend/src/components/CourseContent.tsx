import useBoundStore from "../store";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, ListChecks, Play } from "lucide-react";
import { formatDuration } from "../lib/helpers";
import { cn } from "@heroui/styles";

function CourseContent({ className }: { className?: string }) {
  const { course, lessons, progress, user } = useBoundStore();

  return (
    <div className={cn("bg-background/70 rounded-lg p-4 h-fit", className)}>
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Course Contents
      </h4>
      <div className="flex flex-col gap-2 mt-4">
        {lessons.map((lesson, index) => (
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
                <span className="text-xs text-muted">
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            </div>
            {index + 1 <= progress.completed && course.owner !== user.id && (
              <CheckCircle2 className="text-accent mr-2" size={20} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseContent;
