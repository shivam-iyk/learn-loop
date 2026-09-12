import { Button, Label, ListBox, Select, useTheme } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { appearances, currencies, languages } from "../lib/accessibility";
import useAppStore from "../store";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme("system");
  const { becomeInstructor, user } = useAppStore();

  const [language, setLanguage] = useState("en");

  const handleInstructor = () => {
    becomeInstructor();
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <h3 className="text-font-outfit font-bold tracking-tighter sm:text-3xl text-2xl">
          Settings
        </h3>
        <p className="text-muted max-md:text-sm">
          Manage your preferences and account settings
        </p>
      </div>
      <div className="flex flex-col gap-6 md:w-2/3">
        <div className="flex items-center gap-4">
          <span>Theme</span>
          <div className="flex items-center gap-1 bg-background p-1 rounded-full">
            {appearances.map((item, index) => (
              <button
                className={`p-1 rounded-full ${theme === item.name ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setTheme(item.name)}
                key={index}
              >
                <item.icon size={20} />
              </button>
            ))}
          </div>
        </div>
        <Select name="currency">
          <Label>Language</Label>
          <Select.Trigger>
            <Select.Value className="capitalize" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {languages.map((item, index) => (
                <ListBox.Item
                  id={item.code}
                  textValue={item.name}
                  key={index}
                  className="capitalize"
                >
                  {item.name}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <Select
          name="language"
          value={language}
          onChange={(value) => setLanguage(value?.toString() || "en")}
        >
          <Label>Currency</Label>
          <Select.Trigger>
            <Select.Value className="flex items-center gap-2 capitalize" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {currencies.map((item, index) => (
                <ListBox.Item
                  id={item.code}
                  textValue={item.value}
                  key={index}
                  className="flex items-center gap-2 capitalize"
                >
                  <item.icon size={16} /> {item.value}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      {user.role === "student" ? (
        <div className="bg-accent-soft rounded-lg p-4 md:w-2/3">
          <h4 className="sm:text-2xl text-xl font-outfit font-semibold tracking-tight text-accent">
            Want to teach on LearnLoop?
          </h4>
          <p className="text-muted text-sm mt-2">
            Become an instructor and start creating courses for other learners.
            This action is irreversible and you&apos;ll loose all your courses
            if you&apos;ve bought any.
          </p>
          <Button className="mt-4" onClick={handleInstructor}>
            Become an Instructor
          </Button>
        </div>
      ) : null}
      <Button variant="danger-soft">
        <LogOut />
        Log Out
      </Button>
    </div>
  );
}

export default Settings;
