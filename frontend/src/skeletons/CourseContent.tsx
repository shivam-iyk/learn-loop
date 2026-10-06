import { Skeleton } from "@heroui/react";

function CourseContent() {
  return (
    <div className="bg-background p-4 rounded-lg">
      <Skeleton className="w-40 h-5 mb-3" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="flex items-center gap-2 border rounded-lg border-background-secondary p-2 mb-2"
          key={index}
        >
          <Skeleton className="size-9" />
          <div>
            <Skeleton className="w-10 h-2" />
            <Skeleton className="w-40 h-5 mt-1" />
            <Skeleton className="w-16 h-2 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseContent;
