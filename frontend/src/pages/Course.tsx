import { Skeleton } from "@heroui/react";
import CourseDetails from "../components/CourseDetails";
import CourseStatus from "../components/CourseStatus";
import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import RateCourse from "../components/RateCourse";

const CourseContent = lazy(() => import("../components/CourseContent"));
const Reviews = lazy(() => import("../components/Reviews"));
const InstructorOverview = lazy(
  () => import("../components/InstructorOverview"),
);
const CourseDescription = lazy(() => import("../components/CourseDescription"));

function Course() {
  const params = useParams<{ courseId: string }>();

  return (
    <div className="flex flex-col pb-6 gap-6">
      <CourseDetails>
        <CourseStatus className="max-md:hidden" courseId={params?.courseId} />
      </CourseDetails>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4">
            <CourseStatus
              className="md:hidden py-0 *:max-md:w-full"
              courseId={params?.courseId}
            />
            <Suspense
              fallback={
                <div className="bg-background p-4 rounded-lg">
                  <Skeleton className="w-40 h-5 mb-3" />
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      className="flex items-center gap-2 border rounded-lg border-background-secondary p-2 mb-2"
                      key={index}
                    >
                      <Skeleton className="size-9" />
                      <div>
                        <Skeleton className="w-10 h-2" />
                        <Skeleton className="w-40 h-5 mt-1" />
                        <Skeleton className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <CourseContent className="max-sm:flex-1" />
            </Suspense>
          </div>
          <RateCourse courseId={params.courseId} />
          <Suspense
            fallback={
              <div className="bg-background rounded-lg p-4">
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
            }
          >
            <Reviews className="max-md:w-full" />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 md:col-span-2">
          <Suspense
            fallback={
              <div className="bg-background p-4">
                <Skeleton className="w-28 h-5 mb-4" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-3/4 mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-1/2 mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </div>
            }
          >
            <CourseDescription />
          </Suspense>
          <Suspense
            fallback={
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
            }
          >
            <InstructorOverview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Course;
