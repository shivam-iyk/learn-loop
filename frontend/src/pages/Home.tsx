import { Skeleton } from "@heroui/react";
import CourseCarousel from "../components/CourseCarousel";
import useAppStore from "../store";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UpgradeAlert from "../components/UpgradeAlert";

const HomeCourses = lazy(() => import("../components/HomeCourses"));
const Instructors = lazy(() => import("../components/Instructors"));

function HomeCoursesFallback({ hasVariant = false }: { hasVariant?: boolean }) {
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

function InstructorsFallback() {
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

function Home() {
  const { user } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    const upgrade = searchParams.get("upgrade");

    if (upgrade === "true") {
      setUpgrade(true);
      setSearchParams({});
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col py-6 gap-6">
      <h3 className="font-cal-sans tracking-tight sm:text-3xl text-2xl">
        Welcome <span className="text-accent">{user.name}</span>
      </h3>
      {upgrade && <UpgradeAlert />}
      <CourseCarousel />
      <Suspense fallback={<HomeCoursesFallback />}>
        <HomeCourses
          variant="recommended"
          title="Recommended Courses"
          path="/explore"
        />
      </Suspense>
      <Suspense fallback={<HomeCoursesFallback hasVariant />}>
        <HomeCourses
          variant="category"
          title="Browse by Category"
          path="/explore"
        />
      </Suspense>
      <Suspense fallback={<InstructorsFallback />}>
        <Instructors />
      </Suspense>
      <Suspense fallback={<HomeCoursesFallback />}>
        <HomeCourses
          variant="skills"
          title="Browse by Skills"
          path="/explore?price=0"
        />
      </Suspense>
      <Suspense fallback={<HomeCoursesFallback />}>
        <HomeCourses
          variant="free"
          title="Free Courses"
          path="/explore?price=0"
        />
      </Suspense>
    </div>
  );
}

export default Home;
