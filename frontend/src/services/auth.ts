import api from "./api";

export const login = async (creds: { email: string; password: string }) => {
  const { data } = await api.post("/login", creds);
  return data;
};

export const register = async (creds: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/register", creds);
  return data;
};

export const getUser = async () => {
  const { data } = await api.get("/users");
  return data;
};
