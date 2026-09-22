import api from "./api";

export const getOverview = async () => {
  const { data } = await api.get("/instructors/overview");
  return data?.data;
};

export const getRecentEnrollments = async () => {
  const { data } = await api.get("/instructors/recent-enrollments");
  return data?.data;
};
