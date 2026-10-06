import { Skeleton } from "@heroui/react";

function HomeCourses({ hasVariant = false }: { hasVariant?: boolean }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-3">
        <Skeleton className="h-6 w-60 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      {hasVariant && (
        <div className="flex items-center gap-2 mb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              className="h-8 rounded-full"
              style={{
                width: `${4 + 2 * Math.random()}rem`,
              }}
              key={index}
            />
          ))}
        </div>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="border border-background rounded-xl overflow-hidden"
            key={index}
          >
            <Skeleton className="w-full aspect-video rounded-xl" />
            <div className="flex justify-between">
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-6 w-24 rounded-lg" />
                <Skeleton className="h-3 w-40 rounded-lg" />
                <Skeleton className="h-2 w-16 rounded-lg" />
              </div>
              <div className="flex flex-col gap-2 p-4 justify-center items-end">
                <Skeleton className="h-4 w-8 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomeCourses;
