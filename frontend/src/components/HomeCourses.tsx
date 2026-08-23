import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useBoundStore from "../store";
import HomeCard from "./HomeCard";
import { Button } from "@heroui/react";
import { useMemo, useState } from "react";

interface Props {
  variant?: "recommended" | "free" | "category" | "skills";
  title: string;
  path: string;
}

function HomeCourses({ variant, title, path }: Props) {
  const { courses } = useBoundStore();

  const [current, setCurrent] = useState("All");

  const { categories, skills } = useMemo(() => {
    const categories = new Set<string>();
    const skills = new Set<string>();

    courses.map((item) => {
      categories.add(item.category.toLowerCase());
      if (item.skills) {
        item.skills.map((skill) =>
          skills.has(skill.toLowerCase()) ? null : skills.add(skill),
        );
      }
    });

    return {
      categories: [
        "All",
        ...Array.from(categories).sort((a, b) => a.localeCompare(b)),
      ],
      skills: ["All", ...Array.from(skills).sort((a, b) => a.localeCompare(b))],
    };
  }, [courses]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full mb-3">
        <h3 className="font-huninn uppercase text-muted sm:text-lg text-base">
          {title}
        </h3>
        {variant !== "category" && variant !== "skills" && (
          <Link
            to={path}
            className="text-accent ring-visible rounded-lg group p-1 font-inter-tight"
          >
            <div className="flex gap-1">
              <span className="max-sm:text-sm">View All</span>
              <ArrowRight
                className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
                strokeWidth={1.3}
                size={20}
              />
            </div>
          </Link>
        )}
      </div>
      {variant === "category" && (
        <div className="flex items-center gap-2 mb-3 overflow-auto max-w-full p-1">
          {categories.map((item, index) => (
            <Button
              variant={item === current ? "primary" : "outline"}
              className="rounded-full capitalize transition-colors max-sm:text-sm"
              onClick={() => setCurrent(item)}
              key={index}
            >
              {item}
            </Button>
          ))}
        </div>
      )}
      {variant === "skills" && (
        <div className="flex items-center gap-2 mb-3 overflow-auto max-w-full p-1">
          {skills.map((item, index) => (
            <Button
              variant={item === current ? "primary" : "outline"}
              className="rounded-full capitalize transition-colors max-sm:text-sm"
              onClick={() => setCurrent(item)}
              key={index}
            >
              {item}
            </Button>
          ))}
        </div>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
        {courses
          .filter(
            (item) =>
              (variant === "category"
                ? item.category === current || current.toLowerCase() === "all"
                : item.skills?.includes(current) ||
                  current.toLowerCase() === "all") &&
              (variant !== "free" || item.price === 0),
          )
          .map((item, index) => (
            <HomeCard course={item} key={index} />
          ))}
      </div>
    </div>
  );
}

export default HomeCourses;
