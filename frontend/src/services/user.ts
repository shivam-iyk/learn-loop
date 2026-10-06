import api from "./api";

export const getUser = async () => {
  const { data } = await api.get("/users");
  return data?.data;
};

export const becomeInstructor = async () => {
  const { data } = await api.put("/become-instructor");
  return data?.data;
};

export const getInstructor = async (instructorId: string | number) => {
  const { data } = await api.get(`/instructors/${instructorId}`);
  return data?.data;
};
