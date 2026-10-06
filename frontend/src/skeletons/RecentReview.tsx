import { Skeleton } from "@heroui/react";

function RecentReview() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      className="flex gap-4 border border-default bg-background/50 rounded-lg p-3 w-full"
      key={index}
    >
      <Skeleton className="rounded-full size-10" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-24 h-5 mt-2" />
          </div>
          <Skeleton className="w-20 h-2 self-center" />
        </div>
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </div>
  ));
}

export default RecentReview;
