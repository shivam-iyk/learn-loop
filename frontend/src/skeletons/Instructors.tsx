import { Skeleton } from "@heroui/react";

function Instructors() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-3">
        <Skeleton className="h-6 w-60 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
      </div>
      <div className="flex items-center gap-4 relative overflow-x-auto py-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <div className="border border-background p-3" key={index}>
            <Skeleton className="rounded-full w-40 aspect-square" />
            <Skeleton className="rounded-lg h-6 w-28 mx-auto mt-3" />
            <Skeleton className="rounded-lg h-3 w-full mt-1" />
            <Skeleton className="rounded-xl h-8 w-full mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Instructors;
