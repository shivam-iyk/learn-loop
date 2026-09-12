import api from "./api";
import type { FilterParam } from "../types/course";

export const getSuggestions = async (search: string) => {
  const { data } = await api.get("/courses/suggestions", {
    params: { search },
  });
  return data?.data;
};

export const getCourses = async (filters: FilterParam) => {
  const { data } = await api.get("/courses", {
    params: filters,
  });
  return data?.data;
};

export const getCourse = async (courseId?: string | number) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data?.data;
};

export const createCourse = async (formData: FormData) => {
  const { data } = await api.post("/courses/create", formData);
  return data?.data;
};

export const updateCourse = async (courseId: number, formData: FormData) => {
  const { data } = await api.put(`/courses/edit/${courseId}`, formData);
  return data?.data;
};

export const getEnrolledCourses = async () => {
  const { data } = await api.get("/courses/enrolled");
  return data?.data;
};
