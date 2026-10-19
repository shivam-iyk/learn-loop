import { Skeleton } from "@heroui/react";

function Instructor() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-40 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-24 h-5 rounded-full" />
          <Skeleton className="w-40 h-7.5" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-7 rounded-full" />
            <Skeleton className="w-16 h-7 rounded-full" />
            <Skeleton className="w-28 h-7 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="w-24 h-6" />
      <div className="space-y-1">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

export default Instructor;
