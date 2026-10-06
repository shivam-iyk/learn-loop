import CourseDetails from "../components/CourseDetails";
import CourseStatus from "../components/CourseStatus";
import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import RateCourse from "../components/RateCourse";
import CourseContentSkeleton from "../skeletons/CourseContent";
import ReviewsSkeleton from "../skeletons/Reviews";
import CourseDescriptionSkeleton from "../skeletons/CourseDescription";
import InstructorOverviewSkeleton from "../skeletons/InstructorOverview";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../services/courses";
import type { Course as CourseI } from "../types/course";
import useAppStore from "../store";

const CourseContent = lazy(() => import("../components/CourseContent"));
const Reviews = lazy(() => import("../components/Reviews"));
const InstructorOverview = lazy(
  () => import("../components/InstructorOverview"),
);
const CourseDescription = lazy(() => import("../components/CourseDescription"));

function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const { setCourse } = useAppStore();

  const { data, isLoading } = useQuery<CourseI>({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!courseId,
  });

  useEffect(() => {
    if (!data) return;
    setCourse(data);
  }, [data]);

  return (
    <div className="flex flex-col pb-6 gap-6">
      <CourseDetails isLoading={isLoading}>
        <CourseStatus className="max-md:hidden" courseId={courseId} />
      </CourseDetails>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className="space-y-4 w-full">
          <div className="space-y-4">
            <CourseStatus
              className="md:hidden py-0 *:max-md:w-full"
              courseId={courseId}
            />
            <Suspense fallback={<CourseContentSkeleton />}>
              <CourseContent className="max-sm:flex-1" courseId={courseId} />
            </Suspense>
            <Suspense fallback={<CourseDescriptionSkeleton />}>
              <CourseDescription className="lg:hidden" />
            </Suspense>
          </div>
          <RateCourse courseId={courseId} />
          <Suspense fallback={<ReviewsSkeleton />}>
            <Reviews className="max-md:w-full" courseId={courseId} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 md:col-span-2">
          <Suspense fallback={<CourseDescriptionSkeleton />}>
            <CourseDescription className="max-lg:hidden" />
          </Suspense>
          <Suspense fallback={<InstructorOverviewSkeleton />}>
            <InstructorOverview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Course;
