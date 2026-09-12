import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCurrentUser } from "../hooks/auth";
import { useEffect } from "react";
import useAppStore from "../store";
import { toast } from "@heroui/react";
import { logOut } from "../services/auth";
import { instructorPages, studentPages } from "../lib/helpers";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAppStore();
  const { data, isPending, isError, error } = useCurrentUser();

  useEffect(() => {
    if (isPending) return;

    const pathname = location.pathname;

    const isInstructorPage = instructorPages.some((item) =>
      pathname.includes(item),
    );
    const isStudentPage = studentPages.includes(pathname);
    const isCommonPage =
      studentPages.some((item) => pathname.includes(item)) &&
      instructorPages.some((item) => pathname.includes(item));

    if (isError) {
      if (!isInstructorPage && !isStudentPage) return;

      switch (error?.errors?.[0]) {
        case "TOKEN_REQUIRED":
          navigate("/login");
          break;
        case "INVALID_TOKEN":
          logOut().then(() => navigate("/login"));
          break;
        case "UNAUTHORIZED":
          navigate("/login");
          break;
        case "USER_NOT_FOUND":
          logOut().then(() => navigate("/login"));
          break;
        case "EMAIL_NOT_VERIFIED":
          navigate("/verify-code" + `?email=${error.errors[1] || ""}`);
          break;
        default:
          toast.danger(error.message);
      }
      return;
    }

    if (user?.id !== data?.id) setUser(data);
    if (isCommonPage) return;

    if (data?.role === "instructor" && isStudentPage) {
      navigate("/dashboard");
    } else if (data?.role === "student" && isInstructorPage) {
      navigate("/home");
    }
  }, [isPending, data, isError, error, location.pathname]);

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
