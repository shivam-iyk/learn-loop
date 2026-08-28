import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCurrentUser } from "../hooks/auth";
import { useEffect } from "react";
import useBoundStore from "../store";
import { toast } from "@heroui/react";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useBoundStore();
  const { data, isPending, isError, error } = useCurrentUser();

  useEffect(() => {
    if (isPending) return;
    if (isError) {
      console.log("isError");
      if (error.message === "User not found") {
        toast.danger("Please login again to continue");
      }
      if (!location.pathname.includes("/login")) navigate("/login");
      return;
    }
    setUser(data);
    const isLoggedIn = data.id;
    const isProtectedPage = [
      "/connect",
      "/profile",
      "/settings",
      "/dashboard",
      "/earnings",
      "/courses",
      "/create-course",
      "/my-courses",
    ].includes(location.pathname);
    if (!isLoggedIn && isProtectedPage) {
      console.log("isLoggedIn", isLoggedIn, "isProtectedPage", isProtectedPage);
      navigate("/login");
    }
    const instructorsPage = [
      "/dashboard",
      "/earnings",
      "/create-course",
      "/courses",
    ].some((item) => location.pathname.includes(item));
    const studentsPage = location.pathname.includes("/my-courses");
    if (data?.role === "instructor" && studentsPage) {
      console.log(data?.role, studentsPage);
      navigate("/dashboard");
    } else if (data?.role === "student" && instructorsPage) {
      console.log(data?.role, instructorsPage);
      navigate("/home");
    }
  }, [data]);

  return (
    <div>
      <Navbar />
      <div className={location.pathname.includes("/lesson/") ? "" : "relative"}>
        <div
          className={`${location.pathname.includes("/connect/") ? "md:min-h-screen md:px-6" : "min-h-screen md:px-6 px-4"} max-w-7xl mx-auto w-full`}
        >
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
