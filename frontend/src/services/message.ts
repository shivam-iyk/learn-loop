import api from "./api";

export const getChats = async () => {
  const { data } = await api.get("/messages/chats");
  return data?.data;
};

export const getMessages = async (
  courseId: string | number,
  page: number = 1,
) => {
  const { data } = await api.get(`/messages/${courseId}?page=${page}`);
  return data?.data;
};

export const sendMessage = async (message: FormData) => {
  const { data } = await api.post("/messages/send", message);
  return data?.data;
};

export const editMessage = async (
  messageId: number | string,
  message: string,
) => {
  const { data } = await api.put(`/messages/${messageId}`, { message });
  return data?.data;
};

export const deleteMessage = async (messageId: string | number) => {
  const { data } = await api.delete(`/messages/${messageId}`);
  return data?.data;
};
