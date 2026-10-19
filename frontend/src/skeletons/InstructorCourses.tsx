import { Skeleton } from "@heroui/react";

function InstructorCourses() {
  return (
    <>
      <Skeleton className="w-24 h-6" />
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="flex flex-col rounded-lg overflow-hidden border relative"
            key={index}
          >
            <Skeleton className="absolute w-20 h-6 rounded-full top-2 right-2 z-10" />
            <div className="w-full aspect-video bg-background" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4.5 w-28" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-2.5 w-16" />
              <div className="flex justify-between items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default InstructorCourses;
