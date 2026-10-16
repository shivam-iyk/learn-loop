import { create } from "zustand";
import { createUserSlice } from "../slices/user";
import { createCourseSlice } from "../slices/course";
import { createLessonSlice } from "../slices/lesson";
import { createReviewSlice } from "../slices/review";
import { createQuizSlice } from "../slices/quiz";
import type { UserSlice } from "../types/user";
import type { CourseSlice } from "../types/course";
import type { LessonSlice } from "../types/lesson";
import type { ReviewSlice } from "../types/review";
import type { QuizSlice } from "../types/quiz";
import { createMessageSlice } from "../slices/message";
import type { MessageSlice } from "../types/message";

const useAppStore = create<
  UserSlice & CourseSlice & LessonSlice & ReviewSlice & QuizSlice & MessageSlice
>((...a) => ({
  ...createUserSlice(...a),
  ...createCourseSlice(...a),
  ...createLessonSlice(...a),
  ...createReviewSlice(...a),
  ...createQuizSlice(...a),
  ...createMessageSlice(...a),
}));

export default useAppStore;
