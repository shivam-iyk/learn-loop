import { cn } from "@heroui/styles";
import useAppStore from "../store";

function CourseDescription({ className = "" }: { className?: string }) {
  const { course } = useAppStore();
  return (
    <div className={cn("p-4 bg-background/50 rounded-lg", className)}>
      <h4 className="text-xl font-semibold tracking-tight font-outfit">
        Description
      </h4>
      <div
        className="quill-text mt-2"
        dangerouslySetInnerHTML={{ __html: course?.description }}
      />
    </div>
  );
}

export default CourseDescription;
