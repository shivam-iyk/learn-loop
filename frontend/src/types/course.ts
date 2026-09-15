export interface Course {
  id: number;
  name: string;
  cover: string;
  price: number;
  owner: number;
  description: string;
  status: "draft" | "published" | "archived";
  category: string;
  rating_sum: number;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  skills: string[] | null;
  students_enrolled: number;
  rating_count: number;
  tagline: string;
  lessons: number;
}

export interface CourseSlice {
  loading: false;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  setPagination: (pagination: CourseSlice["pagination"]) => void;
  enrolledCourses: { id: number }[];
  progress: { completed: number; total: number };
  sort: "latest" | "popular" | "price-low" | "price-high";
  setSort: (sort: CourseSlice["sort"]) => void;
  search: string;
  setSearch: (value: string) => void;
  filters: {
    price: number[];
    categories: string[];
    duration: Set<string>;
    rating: number;
    lessons: number[];
  };
  setFilters: (filters: CourseSlice["filters"]) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  course: Course;
  setCourse: (course: CourseSlice["course"]) => void;
  recentCourses: Course[];
  suggestedCourses: Course[];
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
  sort: "latest" | "popular" | "price-low" | "price-high";
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  minLessons: number | null;
  maxLessons: number | null;
}
