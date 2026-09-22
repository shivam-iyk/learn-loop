import { Skeleton } from "@heroui/react";

function QuizSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-28 h-5 rounded-lg" />
      <Skeleton className="w-20 h-3 rounded-lg" />
      <Skeleton className="w-full h-32 rounded-lg" />
      <Skeleton className="w-20 h-3 rounded-lg" />
      <Skeleton className="w-full h-8 rounded-lg" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-32 h-8 rounded-2xl" />
        <Skeleton className="w-32 h-8 rounded-2xl" />
      </div>
      <Skeleton className="w-20 h-3 rounded-lg" />
      <Skeleton className="w-full h-8 rounded-lg" />
      <Skeleton className="w-20 h-3 rounded-lg" />
      <Skeleton className="w-full h-32 rounded-lg" />
    </div>
  );
}

export default QuizSkeleton;
