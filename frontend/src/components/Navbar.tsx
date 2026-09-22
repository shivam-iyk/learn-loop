import useAppStore from "../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Book,
  Cog,
  DollarSign,
  Home,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Network,
  PanelLeft,
  User,
} from "lucide-react";
import { AvatarDropdown } from "./AvatarDropdown";
import { Drawer, Button, Avatar, Accordion } from "@heroui/react";
import Logo from "./Logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../services/api";
import { logOut } from "../services/auth";
import { instructorPages, studentPages } from "../lib/helpers";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, logOut: clearSession } = useAppStore();

  const menu =
    user?.role === "student"
      ? [
          {
            icon: Home,
            name: "Home",
            path: "/home",
          },
          {
            icon: LibraryBig,
            name: "Explore",
            path: "/explore",
          },
          {
            icon: Network,
            name: "Connect",
            path: "/connect",
          },
          {
            icon: Book,
            name: "My Courses",
            path: "/my-courses",
          },
        ]
      : [
          {
            icon: LayoutDashboard,
            name: "Dashboard",
            path: "/dashboard",
          },
          {
            icon: DollarSign,
            name: "Earnings",
            path: "/earnings",
          },
          {
            icon: Network,
            name: "Connect",
            path: "/connect",
          },
          {
            icon: Book,
            name: "Courses",
            path: "/courses",
          },
        ];

  const logOutMutation = useMutation<{} | ApiError>({
    mutationFn: logOut,
    onSuccess: () => {
      clearSession();
      const isProtectedPage = [...studentPages, ...instructorPages].some(
        (item) => location.pathname.includes(item),
      );
      if (isProtectedPage) {
        navigate("/login");
      }
      queryClient.clear();
    },
  });

  return (
    <div
      className={`bg-white/50 dark:bg-black/50 backdrop-blur-lg w-full sm:px-8 px-4 py-2 border-b sticky top-0 left-0 z-50 ${location.pathname.includes("/connect/") ? "max-md:hiddden" : ""}`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Drawer>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" className="group" isIconOnly>
              <Logo className="flex items-center justify-center group-hover:hidden size-fit" />
              <PanelLeft className="hidden group-hover:inline" size={30} />
            </Button>
            <Link
              to={user?.role === "student" ? "/home" : "/dashboard"}
              className="flex justify-center items-center gap-2 p-2 ring-visible ring-background-secondary rounded-lg text-xl font-cal-sans font-semibold"
            >
              LearnLoop
            </Link>
          </div>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.Header>
                  <Drawer.Heading>
                    <div className="flex justify-center items-center gap-2">
                      <Logo />
                      <span className="text-3xl font-extrabold tracking-tighter">
                        LMS
                      </span>
                    </div>
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  <div className="flex flex-col gap-1 mt-8">
                    {menu.map((item, index) => (
                      <Button
                        className="w-full p-0"
                        variant="ghost"
                        slot="close"
                      >
                        <Link
                          className="flex items-center px-3 gap-2 w-full"
                          to={item.path}
                          key={index}
                        >
                          <item.icon />
                          <span className="w-full text-left">{item.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </Drawer.Body>
                <Drawer.Footer>
                  <Accordion className="w-full max-w-md">
                    <Accordion.Item>
                      <Accordion.Heading>
                        <Accordion.Trigger className="rounded-lg hover:bg-hover px-2 py-1 gap-2">
                          <Avatar size="sm" className="rounded-full">
                            <Avatar.Image
                              src={user?.avatar ?? "/avatar-small.png"}
                            />
                            <Avatar.Fallback delayMs={600}>
                              {user?.name[0]}
                            </Avatar.Fallback>
                          </Avatar>
                          <span className="w-full text-left">{user?.name}</span>
                          <Accordion.Indicator />
                        </Accordion.Trigger>
                      </Accordion.Heading>
                      <Accordion.Panel>
                        <Accordion.Body className="pt-2 px-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full p-0"
                            slot="close"
                          >
                            <Link
                              to="/profile"
                              className="flex items-center px-3 gap-2 w-full"
                            >
                              <User />
                              <span className="w-full text-left">Profile</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full p-0"
                            slot="close"
                          >
                            <Link
                              to="/profile"
                              className="flex items-center px-3 gap-2 w-full"
                            >
                              <Cog />
                              <span className="w-full text-left">Settings</span>
                            </Link>
                          </Button>
                          <Button
                            variant="danger-soft"
                            size="sm"
                            className="w-full"
                            slot="close"
                            onClick={() => logOutMutation.mutate()}
                          >
                            <LogOut />
                            <span className="w-full text-left">Log Out</span>
                          </Button>
                        </Accordion.Body>
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Drawer.Footer>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
        <Link
          to={user?.role === "student" ? "/home" : "/dashboard"}
          className="flex justify-center items-center gap-2 p-2 ring-visible rounded-lg max-sm:hidden"
        >
          <Logo />
          <span className="md:text-2xl text-xl font-cal-sans font-semibold tracking-tight">
            LearnLoop
          </span>
        </Link>
        <div className="flex justify-between items-center gap-4 max-sm:hidden group">
          {menu.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`p-2 font-outfit ring-visible rounded-lg hover:text-accent ${location.pathname.includes(item.path) ? "text-accent group-hover:text-muted" : "text-muted"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <AvatarDropdown />
      </div>
    </div>
  );
}

export default Navbar;
