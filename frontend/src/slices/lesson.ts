import type { StateCreator } from "zustand";
import type { LessonSlice } from "../types/lesson";

export const createLessonSlice: StateCreator<LessonSlice> = (set) => ({
  lessons: [],
  lesson: {
    id: 0,
    type: "notes",
    notes: "",
    video: null,
    name: "",
    course: 0,
    duration: 0,
    sequence: 0,
    created_at: "",
  },
  setLessons: (lessons) => {
    set({ lessons });
  },
});
