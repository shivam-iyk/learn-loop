import { Skeleton } from "@heroui/react";

function InstructorOverview() {
  return (
    <div className="bg-background rounded-lg p-4">
      <Skeleton className="w-28 h-5 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-24 rounded-full" />
        <div>
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-28 h-4 mt-2" />
          <Skeleton className="w-24 h-4 mt-2" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Skeleton className="w-20 h-7 rounded-full" />
        <Skeleton className="w-24 h-7 rounded-full" />
        <Skeleton className="w-16 h-7 rounded-full" />
        <Skeleton className="w-28 h-7 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5 mt-1" />
        <Skeleton className="w-1/2 h-5 mt-1" />
        <Skeleton className="w-full h-5 mt-1" />
        <Skeleton className="w-3/4 h-5 mt-1" />
      </div>
    </div>
  );
}

export default InstructorOverview;
