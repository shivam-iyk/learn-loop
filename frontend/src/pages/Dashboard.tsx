import InstructorStats from "../components/InstructorStats";
import useBoundStore from "../store";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCourses from "../components/DashboardCourses";
import Enrollments from "../components/Enrollments";
import TopEarning from "../components/TopEarning";
import RecentReviews from "../components/RecentReviews";

function Dashboard() {
  const { name } = useBoundStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-cal-sans tracking-tight sm:text-3xl text-2xl">
          Welcome <span className="text-accent">{name}</span>
        </h3>
        <Link
          to="/create-course"
          className="button button--primary ring-visible-offset"
        >
          <Plus />
          <span className="max-sm:hidden">Create Course</span>
        </Link>
      </div>
      <InstructorStats />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
        <div className="flex flex-col gap-6 md:col-span-2">
          <DashboardCourses />
          <RecentReviews />
        </div>
        <div className="flex flex-col gap-6">
          <Enrollments />
          <TopEarning />
        </div>
      </div>
      {/*
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className="flex flex-col gap-4 h-fit col-span-2">
        </div>
        <div className="flex flex-col gap-4 h-fit">
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
