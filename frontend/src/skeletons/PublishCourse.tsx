import { Skeleton } from "@heroui/react";

function PublishCourse() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-80" />
      </div>
      <div className="bg-background rounded-lg">
        <div className="h-40 w-full bg-background-secondary mb-4" />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="w-60 h-8" />
            <Skeleton className="w-80 h-4" />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="border h-32 rounded-lg" />
            <div className="border h-32 rounded-lg" />
            <div className="border h-32 rounded-lg" />
          </div>
          <Skeleton className="w-20 h-6" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="w-20 h-8 rounded-full" key={index} />
            ))}
          </div>
          <div className="bg-background-secondary md:h-60 h-40 rounded-lg" />
          <Skeleton className="w-24 h-6" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="" key={index}>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex items-center gap-2">
                <div className="size-8 bg-background-secondary rounded-2xl" />
                <Skeleton className="h-8 flex-1" />
                <div className="size-8 bg-background-secondary rounded-2xl" />
                <div className="size-8 bg-background-secondary rounded-2xl" />
              </div>
            </div>
          ))}
          <Skeleton className="w-30 h-8 mx-auto rounded-2xl" />
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Skeleton className="w-20 h-8 rounded-2xl" />
        <Skeleton className="w-30 h-8 rounded-2xl" />
      </div>
    </div>
  );
}

export default PublishCourse;
