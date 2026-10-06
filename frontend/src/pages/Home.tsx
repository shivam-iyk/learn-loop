import CourseCarousel from "../components/CourseCarousel";
import useAppStore from "../store";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UpgradeAlert from "../components/UpgradeAlert";
import HomeCoursesSkeleton from "../skeletons/HomeCourses";
import InstructorsSkeleton from "../skeletons/HomeCourses";

const HomeCourses = lazy(() => import("../components/HomeCourses"));
const Instructors = lazy(() => import("../components/Instructors"));

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
      <Suspense fallback={<HomeCoursesSkeleton />}>
        <HomeCourses
          variant="recommended"
          title="Recommended Courses"
          path="/explore"
        />
      </Suspense>
      <Suspense fallback={<HomeCoursesSkeleton hasVariant />}>
        <HomeCourses
          variant="category"
          title="Browse by Category"
          path="/explore"
        />
      </Suspense>
      <Suspense fallback={<InstructorsSkeleton />}>
        <Instructors />
      </Suspense>
      <Suspense fallback={<HomeCoursesSkeleton />}>
        <HomeCourses
          variant="skills"
          title="Browse by Skills"
          path="/explore?price=0"
        />
      </Suspense>
      <Suspense fallback={<HomeCoursesSkeleton />}>
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
