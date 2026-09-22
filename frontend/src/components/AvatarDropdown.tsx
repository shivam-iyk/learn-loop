import { Avatar, Dropdown, Label } from "@heroui/react";
import { Cog, LogOut, User } from "lucide-react";
import useAppStore from "../store";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../services/api";
import { logOut } from "../services/auth";
import { instructorPages, studentPages } from "../lib/helpers";

export function AvatarDropdown() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user, logOut: clearSession } = useAppStore();

  const logOutMutation = useMutation<{} | ApiError>({
    mutationFn: logOut,
    onSuccess: () => {
      clearSession();
      const isProtectedPage = [...studentPages, ...instructorPages].some(
        (item) => location.pathname.includes(item),
      );
      queryClient.clear();
      if (isProtectedPage) {
        navigate("/login");
      }
    },
  });

  if (!user?.id) {
    return (
      <>
        <div className="flex items-center gap-2 max-md:hidden max-sm:flex">
          <Link
            to="/login"
            className="button button--outline ring-visible-offset"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="button button-linear ring-visible-offset"
          >
            Register
          </Link>
        </div>
        <Dropdown>
          <Dropdown.Trigger className="rounded-full md:hidden max-sm:hidden">
            <Avatar className="rounded-full">
              <Avatar.Image src={"/avatar-small.png"} />
              <Avatar.Fallback delayMs={600}>L</Avatar.Fallback>
            </Avatar>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom right">
            <Dropdown.Menu>
              <Dropdown.Item
                id="profile"
                textValue="Profile"
                onAction={() => navigate("/login")}
              >
                <Label className="w-full">Login</Label>
              </Dropdown.Item>
              <Dropdown.Item
                id="settings"
                textValue="Settings"
                onAction={() => navigate("/register")}
              >
                <Label>Register</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar className="rounded-full">
          <Avatar.Image src={user?.avatar ?? "/avatar-small.png"} />
          <Avatar.Fallback delayMs={600}>{user?.name[0]}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom right">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm" className="bg-transparent">
              <Avatar.Image
                alt="Jane"
                src={user?.avatar ?? "/avatar-big.png"}
              />
              <Avatar.Fallback delayMs={600}>{user?.name[0]}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="leading-5 text-base tracking-tight font-medium whitespace-nowrap font-outfit">
                Jane Doe
              </p>
              <p className="text-xs leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            id="profile"
            textValue="Profile"
            onAction={() => navigate("/profile")}
          >
            <Label className="w-full">Profile</Label>
            <User className="size-3.5 text-muted" />
          </Dropdown.Item>
          <Dropdown.Item
            id="settings"
            textValue="Settings"
            onAction={() => navigate("/settings")}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Settings</Label>
              <Cog className="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            id="logout"
            textValue="Logout"
            variant="danger"
            onAction={() => logOutMutation.mutate()}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <LogOut className="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
