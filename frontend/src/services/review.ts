import api from "./api";

export const getInstructorReviews = async () => {
  const { data } = await api.get("/reviews/instructor");
  return data?.data;
};
