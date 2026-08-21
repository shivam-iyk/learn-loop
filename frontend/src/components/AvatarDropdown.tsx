import { Avatar, Dropdown, Label } from "@heroui/react";
import { Cog, LogOut, User } from "lucide-react";
import useBoundStore from "../store";
import { useNavigate } from "react-router-dom";

export function AvatarDropdown({ handleLogOut }: { handleLogOut: () => void }) {
  const router = useNavigate();

  const { name, email, avatar } = useBoundStore((state) => state.user);

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar className="rounded-full">
          <Avatar.Image src={avatar ?? "/avatar-small.png"} />
          <Avatar.Fallback delayMs={600}>{name[0]}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm" className="bg-transparent">
              <Avatar.Image alt="Jane" src={avatar ?? "/avatar-big.png"} />
              <Avatar.Fallback delayMs={600}>{name[0]}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="leading-5 text-base tracking-tight font-medium whitespace-nowrap font-outfit">
                Jane Doe
              </p>
              <p className="text-xs leading-none text-muted">{email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            id="profile"
            textValue="Profile"
            onAction={() => router("/profile")}
          >
            <Label className="w-full">Profile</Label>
            <User className="size-3.5 text-muted" />
          </Dropdown.Item>
          <Dropdown.Item
            id="settings"
            textValue="Settings"
            onAction={() => router("/settings")}
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
            onAction={handleLogOut}
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
