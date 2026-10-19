import { Skeleton } from "@heroui/react";

function CourseCarousel() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-3 min-h-10">
        <Skeleton className="w-48 h-4.5" />
        <div className="flex items-center gap-2 pr-4">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>
      <div className="flex items-center gap-4 overflow-x-hidden">
        <Skeleton className="w-[70%] shrink-0 aspect-video rounded-2xl" />
        <Skeleton className="w-[70%] shrink-0 aspect-video rounded-2xl" />
        <Skeleton className="w-[70%] shrink-0 aspect-video rounded-2xl" />
      </div>
    </div>
  );
}

export default CourseCarousel;
