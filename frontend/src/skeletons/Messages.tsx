import { Skeleton } from "@heroui/react";

export function ChatInfo() {
  return (
    <div className="flex items-center gap-2 p-3 h-18 border-b max-md:fixed top-0 max-md:z-50 left-0 max-md:bg-background max-md:w-full">
      <Skeleton className="md:hidden size-6 rounded-2xl m-2" />
      <Skeleton className="rounded-full size-10" />
      <div className="space-y-2">
        <Skeleton className="w-40 h-5 rounded-xl" />
        <Skeleton className="w-32 h-3 rounded-xl" />
      </div>
    </div>
  );
}

function Messages() {
  return (
    <div className="flex flex-col gap-2 w-full overflow-hidden">
      {Array.from({ length: 16 }).map((_, index) => (
        <Skeleton
          className={`h-9 w-32 rounded-3xl ${index % 2 !== 0 ? "self-end" : "self-start"}`}
          key={index}
        />
      ))}
    </div>
  );
}

export default Messages;
