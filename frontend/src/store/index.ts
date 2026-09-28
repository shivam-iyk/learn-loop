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
import type { QuizSliceI } from "../types/quiz";

const useAppStore = create<
  UserSlice & CourseSlice & LessonSlice & ReviewSlice & QuizSliceI
>((...a) => ({
  ...createUserSlice(...a),
  ...createCourseSlice(...a),
  ...createLessonSlice(...a),
  ...createReviewSlice(...a),
  ...createQuizSlice(...a),
}));

export default useAppStore;
