import type { StateCreator } from "zustand";
import type { CourseSlice } from "../types/course";

export const createCourseSlice: StateCreator<CourseSlice> = (set) => ({
  loading: false,
  sort: "latest",
  pagination: {
    page: 1,
    pages: 1,
    limit: 10,
    total: 0,
  },
  setPagination: (pagination) => {
    set({ pagination });
  },
  setSort: (sort) => {
    set({ sort });
  },
  search: "",
  setSearch: (search) => set({ search }),
  filters: {
    price: [0, 100_000],
    categories: [],
    duration: new Set(),
    rating: 0,
    lessons: [0, -1],
  },
  setFilters: (filters: CourseSlice["filters"]) => {
    set({ filters });
  },
  course: {
    id: 0,
    name: "",
    tagline: "",
    description: "",
    owner: 0,
    is_banned: false,
    status: "draft",
    students_enrolled: 0,
    ban_reason: null,
    skills: null,
    cover: "",
    category: "",
    price: 0,
    rating_sum: 0,
    rating_count: 0,
    owner_name: "",
    owner_avatar: "",
    lessons: 0,
    created_at: "",
  },
  setCourse: (course) => {
    set({ course });
  },
  enrolledCourses: [],
  progress: { completed: 0, total: 0 },
  courses: [],
  setCourses: (courses) => {
    set({ courses });
  },
  suggestedCourses: [],
  recentCourses: [],
});
