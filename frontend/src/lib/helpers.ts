import {
  intervalToDuration,
  formatDuration as formatDurationFns,
} from "date-fns";
import type { CourseSlice } from "../types/course";

export function formatDuration(seconds: number | string) {
  if (typeof seconds === "string") {
    seconds = parseInt(seconds);
  }

  const { hours = 0, minutes = 0 } = intervalToDuration({
    start: 0,
    end: seconds * 1000,
  });

  return formatDurationFns({ hours, minutes }, { delimiter: ", " });
}

export const getPageNumbers = (pagination: CourseSlice["pagination"]) => {
  const pages: (number | "ellipsis")[] = [];
  if (pagination.pages <= 7) {
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (pagination.page > 3) {
      pages.push("ellipsis");
    }
    const start = Math.max(2, pagination.page - 1);
    const end = Math.min(pagination.pages - 1, pagination.page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (pagination.page < pagination.pages - 2) {
      pages.push("ellipsis");
    }
    pages.push(pagination.pages);
  }
  return pages;
};

export const instructorPages = [
  "/dashboard",
  "/earnings",
  "/create-course",
  "/connect",
  "/courses",
  "/profile",
  "/settings",
];

export const studentPages = [
  "/my-courses",
  "/connect",
  "/profile",
  "/settings",
];
