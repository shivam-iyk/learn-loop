export interface Course {
  id: number;
  name: string;
  cover: string;
  price: number;
  owner: number;
  description: string;
  language: string;
  status: "draft" | "published" | "archived";
  category: string;
  rating_sum: number;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  skills: string[] | null;
  owner_name?: string;
  owner_avatar?: string;
  students_enrolled: number;
  rating_count: number;
  tagline: string;
  lessons: number;
}

export interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export interface Filters {
  price: number[];
  categories: string[];
  duration: Set<string>;
  rating: number;
  lessons: number[];
}

export type SortTypes = "latest" | "popular" | "price-low" | "price-high";

export interface CourseSlice {
  loading: false;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  enrolledCourses: { id: number }[];
  progress: { completed: number; total: number };
  sort: SortTypes;
  setSort: (sort: SortTypes) => void;
  search: string;
  setSearch: (value: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  course: Course;
  setCourse: (course: Course) => void;
  recentCourses: Course[];
  suggestedCourses: Course[];
  setSuggestedCourses: (courses: Course[]) => void;
  setRecentCourses: (courses: Course[]) => void;
}

export interface CourseDetailsFormI {
  name: string;
  tagline: string;
  description: string;
  category: string;
  skills: string[];
  price: string;
}

export interface FilterParam {
  categories: string | null;
  page: number;
  limit: number;
  search: string | null;
  sort: SortTypes;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  minLessons: number | null;
  maxLessons: number | null;
}
