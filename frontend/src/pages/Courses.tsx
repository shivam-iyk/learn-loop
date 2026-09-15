import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ManageCourses from "../components/ManageCourses";
import DraftCourses from "../components/DraftCourses";
import ArchivedCourses from "../components/ArchivedCourses";
import { useQuery } from "@tanstack/react-query";
import { getOwnedCourses } from "../services/courses";
import { useEffect } from "react";
import useAppStore from "../store";

function Courses() {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getOwnedCourses,
    staleTime: 15 * 1000 * 60, // 15 minutes
  });

  const { setCourses } = useAppStore();

  useEffect(() => {
    if (!data) return;
    setCourses(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="font-cal-sans tracking-tight sm:text-3xl text-2xl">
            My Courses
          </h3>
          <p className="text-muted">Manage, Edit and Track all your courses</p>
        </div>
        <Link
          to="/create-course"
          className="button button--primary ring-visible-offset"
        >
          <Plus />
          <span className="max-sm:hidden">Create Course</span>
        </Link>
      </div>
      <ManageCourses loading={isLoading} />

      <div>
        <h3 className="font-cal-sans tracking-tight sm:text-3xl text-2xl">
          Drafts
        </h3>
        <p className="text-muted">Work in Progress</p>
      </div>
      <DraftCourses loading={isLoading} />

      <div>
        <h3 className="font-cal-sans tracking-tight sm:text-3xl text-2xl">
          Archived
        </h3>
        <p className="text-muted">No Longer Active</p>
      </div>
      <ArchivedCourses loading={isLoading} />
    </div>
  );
}

export default Courses;
