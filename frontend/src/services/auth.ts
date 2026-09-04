import api from "./api";

export const login = async (creds: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", creds);
  return data?.data;
};

export const register = async (creds: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/register", creds);
  return data?.data;
};

export const verifyCode = async (creds: { email: string; code: number }) => {
  const { data } = await api.put("/auth/verify-mail", creds);
  return data?.data;
};

export const resendVerificationCode = async (email: string) => {
  const { data } = await api.put("/auth/resend-code", { email });
  return data?.data;
};

export const logOut = async () => {
  const { data } = await api.get("/auth/logout");
  return data?.data;
};
