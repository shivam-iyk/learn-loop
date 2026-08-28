import api from "./api";

export const becomeInstructor = async () => {
  const { data } = await api.put("/become-instructor");
  return data.success ? data?.data : data;
};
