import api from "./api";

export const getQuiz = async (lessonId: number) => {
  const { data } = await api.get(`/quiz/${lessonId}`);
  return data?.data;
};
