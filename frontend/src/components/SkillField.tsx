import {
  Chip,
  Description,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import React, { useState } from "react";
import { skillSchema } from "../schema/course";
import { XIcon } from "lucide-react";

function SkillField({
  skills,
  setSkills,
}: {
  skills: string[];
  setSkills: (skills: string[]) => void;
}) {
  const [skill, setSkill] = useState("");

  const handleSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const skillValue = skill.trim();
    if (!skillValue) return;

    if (skills.includes(skillValue)) return;
    setSkills([...skills, skillValue]);
    setSkill("");
  };

  const handleSkillList = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
      return;
    }

    const items = Array.from(e.currentTarget.querySelectorAll("button"));
    if (!items.length) return;

    const current = document.activeElement?.closest(
      "button",
    ) as HTMLButtonElement | null;
    if (!current) return;

    const index = items.indexOf(current);
    if (index === -1) return;

    e.preventDefault();

    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % items.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
    }

    items.forEach((item) => (item.tabIndex = -1));

    const next = items[nextIndex];
    next.tabIndex = 0;
    next.focus();
  };

  const handleRemoveSkill = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: string,
  ) => {
    setSkills(skills.filter((skill) => skill !== item));
    const skillsList = e.currentTarget.parentElement;
    if (
      skillsList?.attributes.getNamedItem("aria-label") &&
      skillsList.children.length >= 1
    ) {
      const items = Array.from(skillsList.querySelectorAll("button"));
      const lastElement = items[items.length - 1];
      if (lastElement === e.currentTarget) {
        if (skillsList.children.length >= 2) {
          items[items.length - 2]?.focus();
        } else {
          skillsList.parentNode?.querySelector("input")?.focus();
        }
      } else {
        lastElement?.focus();
      }
    }
  };

  return (
    <TextField
      name="skills"
      type="text"
      onKeyDown={handleSkill}
      value={skill}
      onChange={(value) => setSkill(value)}
      isDisabled={skills.length >= 10}
      validate={(value) => {
        const result = skillSchema.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      }}
    >
      <Label>Skills</Label>
      <Input
        placeholder={
          skills.length >= 10
            ? "You can add up to 10 skills"
            : "Skills to be learnt by course"
        }
        enterKeyHint="enter"
      />
      <FieldError />
      {skills.length === 0 && (
        <Description>Press enter to add a new skill</Description>
      )}
      <div
        className="flex items-center flex-wrap gap-1 mt-1"
        onKeyDown={handleSkillList}
        aria-label="Skills"
      >
        {skills.map((item, index) => (
          <button
            type="button"
            className="rounded-full size-fit cursor-pointer ring-visible"
            tabIndex={index === 0 ? 0 : -1}
            onClick={(e) => handleRemoveSkill(e, item)}
            key={index}
          >
            <Chip className="bg-accent-soft text-accent rounded-full capitalize flex items-center gap-1">
              {item}
              <XIcon size={12} />
            </Chip>
          </button>
        ))}
      </div>
    </TextField>
  );
}

export default SkillField;
