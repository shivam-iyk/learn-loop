import type { QuizI } from "./quiz";

export interface LessonFormI {
  id: number;
  type: "notes" | "video" | "quiz";
  name: string;
  video: string;
  notes: string;
  sequence: number;
  quiz: QuizI | null;
}

export interface EditLessonI {
  id: number;
  type?: "notes" | "video" | "quiz" | null;
  name?: string | null;
  video?: string | null;
  notes?: string | null;
  sequence?: number | null;
  quiz?: QuizI | null | null;
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
  quiz?: QuizI | null;
}

export interface LessonSlice {
  lessons: Lesson[];
  lesson: Lesson;
  setLessons: (lessons: Lesson[]) => void;
}
