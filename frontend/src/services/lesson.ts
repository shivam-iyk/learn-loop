import type { EditLessonI, LessonFormI } from "../types/lesson";
import api from "./api";

export const createLesson = async (
  lesson: LessonFormI | { course: number | string; video: string | null },
) => {
  const { data } = await api.post("/lessons", lesson);
  return data?.data;
};

export const editLesson = async (lesson: EditLessonI) => {
  const { data } = await api.put(`/lessons/${lesson?.id}`, lesson);
  return data?.data;
};

export const getLessons = async (courseId?: number | string) => {
  const { data } = await api.get(`/lessons/${courseId}`);
  return data?.data;
};

export const reorderLesson = async (
  lessons: {
    id: number;
    sequence: number;
  }[],
) => {
  const { data } = await api.put("/lessons/reorder", { lessons });
  return data?.data;
};

export const deleteLesson = async (lessonId: string | number) => {
  const { data } = await api.delete(`/lessons/${lessonId}`);
  return data?.data;
};
