import type { StateCreator } from "zustand";
import type { ReviewSlice } from "../types/review";

export const createReviewSlice: StateCreator<ReviewSlice> = (set) => ({
  reviews: [],
  setReviews: (reviews) => {
    set({reviews});
  },
});
