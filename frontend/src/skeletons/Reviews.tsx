import { Skeleton } from "@heroui/react";

function Reviews() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="w-44 h-5 mb-3" />
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="p-2 last:border-t" key={index}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="size-7 rounded-full" />
              <div className="ml-2">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-20 h-3 mt-1" />
              </div>
            </div>
            <Skeleton className="w-20 h-3" />
          </div>
          <div className="mt-2">
            <Skeleton className="w-full h-3 mt-1 rounded-lg" />
            <Skeleton className="w-full h-3 mt-1 rounded-lg" />
            <Skeleton className="w-1/2 h-3 mt-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
