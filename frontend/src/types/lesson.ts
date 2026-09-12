import type { QuizFormI } from "./quiz";

export interface LessonFormI {
  id: number;
  type: "notes" | "video" | "quiz";
  name: string;
  video: string;
  notes: string;
  sequence: number;
  quiz: QuizFormI | null;
}

export interface EditLessonI {
  id: number;
  type?: "notes" | "video" | "quiz" | null;
  name?: string | null;
  video?: string | null;
  notes?: string | null;
  sequence?: number | null;
  quiz?: QuizFormI | null | null;
}

export interface Lesson {
  id: number;
  name: string;
  type: "video" | "notes" | "quiz";
  video: string | null;
  notes: string | null;
  course: number;
  sequence: number;
  created_at: string;
}

export interface LessonSlice {
  lessons: Lesson[];
  lesson: Lesson;
  setLessons: (lessons: Lesson[]) => void;
}
