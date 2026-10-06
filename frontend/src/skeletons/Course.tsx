import { Skeleton } from "@heroui/react";

function Course() {
  return (
    <div className="flex items-center gap-4 rounded-lg p-3 border border-default bg-background/50 relative">
      <Skeleton className="size-24 rounded-lg" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="w-32 h-4" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-28 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="w-18 h-5" />
          <Skeleton className="w-10 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default Course;
