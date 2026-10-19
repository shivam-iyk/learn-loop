import api from "./api";
import type { FilterParam } from "../types/course";

export const getSuggestions = async (search: string) => {
  const { data } = await api.get("/courses/search-suggestions", {
    params: { search },
  });
  return data?.data;
};

export const getCourses = async (filters?: FilterParam) => {
  const { data } = await api.get("/courses", {
    params: filters,
  });
  return data?.data;
};

export const getCourse = async (courseId?: string | number) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data?.data;
};

export const getOwnedCourses = async () => {
  const { data } = await api.get("/courses/owned");
  return data?.data;
};

export const getHomeCourses = async (
  variant: "skills" | "category" | "recommended" | "free",
  skill?: string,
  category?: string,
) => {
  const { data } = await api.get("/courses/home", {
    params: {
      skill,
      variant,
      category,
    },
  });
  return data?.data;
};

export const getCarouselCards = async () => {
  const { data } = await api.get("/courses/carousel");
  return data?.data;
};

export const getInstructorCourses = async (instructorId: string | number) => {
  const { data } = await api.get(`/courses/instructor/${instructorId}`);
  return data?.data;
};

export const createCourse = async (formData: FormData) => {
  const { data } = await api.post("/courses/create", formData);
  return data?.data;
};

export const updateCourse = async (
  courseId: string | number,
  formData: FormData,
) => {
  const { data } = await api.put(`/courses/edit/${courseId}`, formData);
  return data?.data;
};

export const discardDraft = async (courseId: number) => {
  const { data } = await api.delete(`/courses/draft/${courseId}`);
  return data?.data;
};

export const getEnrolledCourses = async () => {
  const { data } = await api.get("/courses/enrolled");
  return data?.data;
};

export const getTopEarningCourses = async () => {
  const { data } = await api.get("/courses/top-earning");
  return data?.data;
};
