export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar: string;
  rating: number;
  review: string;
  created_at: string;
  course: number;
  course_name: string;
}

export interface ReviewSlice {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}
