import useAppStore from "../store";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  const location = useLocation();
  const { role } = useAppStore((state) => state.user);
  const portfolio = import.meta.env.PORTFOLIO_URL;

  const menu =
    role === "student"
      ? [
          {
            name: "Home",
            path: "/home",
          },
          {
            name: "Courses",
            path: "/explore",
          },
          {
            name: "Learn Loop",
            path: "/home",
          },
          {
            name: "My Courses",
            path: "/my-courses",
          },
          {
            name: "Connect",
            path: "/connect",
          },
        ]
      : [
          {
            name: "Dashboard",
            path: "/dashboard",
          },
          {
            name: "Earnings",
            path: "/earnings",
          },
          {
            name: "Learn Loop",
            path: "/home",
          },
          {
            name: "Connect",
            path: "/connect",
          },
          {
            name: "Courses",
            path: "/courses",
          },
        ];

  return (
    <div
      className={`flex flex-col bg-footer text-footer-foreground tracking-tight ${location.pathname.includes("/connect/") ? "max-md:hidden" : ""} `}
    >
      <div className="flex max-md:flex-col justify-evenly items-center px-4 py-8 gap-4 font-outift">
        <Link
          to="/home"
          className="flex flex-col items-center justify-center gap-2 md:hidden mb-4 ring-visible"
        >
          <Logo />
          <h3 className="text-2xl font-extrabold font-cal-sans leading-4">
            Learn Loop
          </h3>
          <span className="text-muted text-center font-lora">
            {role === "student"
              ? "Learn Today. Lead Tomorrow."
              : "Teach. Inspire. Transform."}
          </span>
        </Link>
        {menu.map((item, index) => {
          if (item.name === "Learn Loop") {
            return (
              <Link
                to={item.path}
                key={index}
                className="flex flex-col items-center justify-center gap-2 max-md:hidden ring-visible rounded-lg p-2"
              >
                <Logo className="w-12" />
                <h3 className="text-2xl font-bold font-cal-sans">
                  {item.name}
                </h3>
                <span className="text-muted text-center w-60">
                  {role === "student"
                    ? "Learn Today. Lead Tomorrow."
                    : "Teach. Inspire. Transform."}
                </span>
              </Link>
            );
          } else
            return (
              <Link
                to={item.path}
                className="font-medium ring-visible rounded-lg p-2 font-outfit hover:underline underline-offset-1"
                key={index}
              >
                {item.name}
              </Link>
            );
        })}
      </div>
      <div className="border-t border-footer-border">
        <div className="flex items-center justify-between p-4 text-xs text-white max-w-7xl mx-auto">
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
    </div>
  );
}

export default Footer;
