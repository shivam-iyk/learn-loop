import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCurrentUser } from "../hooks/auth";
import { useEffect } from "react";
import useBoundStore from "../store";
import { toast } from "@heroui/react";
import { logOut } from "../services/auth";
import { instructorPages, studentPages } from "../lib/helpers";

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useBoundStore();
  const { data, isPending, isError, error } = useCurrentUser();

  useEffect(() => {
    if (isPending) return;

    const isInstructorPage = instructorPages.some((item) =>
      location.pathname.includes(item),
    );
    const isStudentPage = studentPages.includes(location.pathname);
    const isProtectedPage = isInstructorPage || isStudentPage;
    console.log(
      isError && isProtectedPage,
      isError,
      isInstructorPage,
      isStudentPage,
    );

    if (isError && isProtectedPage) {
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

    if (!isError) setUser(data);

    if (data?.role === "instructor" && isStudentPage) {
      console.log(data?.role, isStudentPage);
      navigate("/dashboard");
    } else if (data?.role === "student" && isInstructorPage) {
      console.log(data?.role, isInstructorPage);
      navigate("/home");
    }
  }, [isPending, data, isError, error]);

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
