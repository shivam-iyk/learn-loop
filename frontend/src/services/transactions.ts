import api from "./api";

export const getInstructorTransacations = async () => {
  const { data } = await api.get("/transactions/instructor");
  return data?.data;
};
