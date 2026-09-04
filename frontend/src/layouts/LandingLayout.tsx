import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ListBox, ListBoxItem, Select } from "@heroui/react";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import Logo from "../components/Logo";
import { useCurrentUser } from "../hooks/auth";
import { AvatarDropdown } from "../components/AvatarDropdown";
import useBoundStore from "../store";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {} = useCurrentUser();
  const { user } = useBoundStore();

  const menu = location.pathname.includes("/instructor")
    ? [
        {
          title: "Home",
          path: "#home",
        },
        { title: "Features", path: "#features" },
        { title: "Build", path: "#learning" },
        { title: "Connect", path: "#connect" },
        { title: "Publish", path: "#courses" },
      ]
    : [
        {
          title: "Home",
          path: "#home",
        },
        { title: "Features", path: "#features" },
        { title: "Learning", path: "#learning" },
        { title: "Connect", path: "#connect" },
        { title: "Courses", path: "#courses" },
      ];

  const [portal, setPortal] = useState(
    location.pathname.includes("/instructor") ? "/instructor" : "/",
  );

  return (
    <nav className="border-b p-2 sticky top-0 left-0 backdrop-blur-sm bg-white/50 dark:bg-black/50 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 ring-visible p-1 rounded-lg"
          >
            <Logo />
            <span className="md:text-2xl text-xl max-sm:hidden font-cal-sans font-bold tracking-tight">
              Learn Loop
            </span>
          </Link>
          <Select
            name="portal"
            aria-label="select-portal"
            value={portal}
            onChange={(value) => {
              if (!value) return;
              navigate(value.toString());
              setPortal(value.toString());
            }}
          >
            <Select.Trigger className="bg-transparent shadow-none pl-0">
              <Select.Value className="text-xl text-muted group font-cal-sans" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {["/", "/instructor"].map((item, index) => (
                  <ListBoxItem
                    id={item}
                    textValue={item}
                    key={index}
                    className="font-cal-sans text-muted"
                  >
                    {item === "/" ? "/student" : item}{" "}
                    {portal === item && (
                      <Check
                        className="group-first:hidden absolute right-2"
                        size={16}
                      />
                    )}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
        <div className="md:flex hidden items-center justify-between w-1/3">
          {menu.map((item, index) => (
            <a
              href={item.path}
              className="text-muted text-sm font-outfit hover:text-accent p-2 rounded-lg ring-visible"
              key={index}
            >
              {item.title}
            </a>
          ))}
        </div>
        {user?.id ? (
          <AvatarDropdown />
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="button button--sm button--outline ring-visible-offset"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="button button--sm button--primary ring-visible-offset"
            >
              Start Free <ChevronRight />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const portfolio = import.meta.env.VITE_APP_PORTFOLIO_URL;
  const role = location.pathname.includes("/instructor")
    ? "instructor"
    : "student";

  const nav =
    role === "student"
      ? [
          {
            title: "Home",
            path: "#home",
          },
          {
            title: "Features",
            path: "#features",
          },
          {
            title: "Learning",
            path: "#learning",
          },
          {
            title: "Connect",
            path: "#connect",
          },
          {
            title: "Courses",
            path: "#courses",
          },
        ]
      : [
          {
            title: "Home",
            path: "#home",
          },
          {
            title: "Features",
            path: "#features",
          },
          {
            title: "Build",
            path: "#learning",
          },
          {
            title: "Connect",
            path: "#connect",
          },
          {
            title: "Publish",
            path: "#courses",
          },
        ];

  return (
    <footer className="bg-footer">
      <div className="p-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 text-footer-foreground w-full">
            <Logo />
            <div>
              <h4 className="text-xl font-cal-sans tracking-tighter">
                Learn Loop
              </h4>
              <p className="text-muted text-sm">
                {role === "student"
                  ? "Discover courses that inspire curiosity, build practical skills, and help you achieve your goals at your own pace."
                  : "Empowering learners and educators with a platform to learn, teach, collaborate, and grow together with confidence."}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 md:justify-evenly sm:justify-start max-md:mt-6 w-full">
            <div className="flex flex-col text-footer-foreground">
              <h4 className="text-xl font-semibold">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-muted font-outfit mt-4">
                {nav.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="hover:underline underline-offset-2"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col text-footer-foreground">
              <h4 className="text-xl font-semibold">
                For {role === "instructor" ? "Students" : "Instructors"}
              </h4>
              <ul className="flex flex-col gap-2 text-muted font-outfit mt-4">
                <li>
                  <a
                    href={role === "instructor" ? "/" : "/instructor"}
                    className="hover:underline underline-offset-2"
                  >
                    {role === "instructor"
                      ? "Student Portal"
                      : "Become an Instructor"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-footer-border p-4">
        <div className="flex items-center justify-between text-xs text-muted max-w-7xl mx-auto">
          <span>&copy; Copyright Reserved</span>
          <span>
            Made with ❤️ by{" "}
            <Link
              to={portfolio}
              target="_blank"
              className="hover:underline hover:text-accent transition-colors ring-visible rounded"
            >
              Shivam
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

function LandingLayout() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="min-h-screen w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingLayout;
