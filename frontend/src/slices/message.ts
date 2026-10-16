import type { StateCreator } from "zustand";
import type { MessageSlice } from "../types/message";

export const createMessageSlice: StateCreator<MessageSlice> = (set) => ({
  chats: [],
  messages: [],
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set(({ messages, chats }) => ({
      messages: [{ ...message, isLoading: false }, ...messages],
      chats: chats.map((item) => {
        if (item.id === Number(message?.course)) {
          return {
            ...item,
            last_message: message?.content || item.tagline,
            last_message_at: message?.created_at,
          };
        }
        return item;
      }),
    })),
  updateMessage: (message, tempId) =>
    set(({ messages }) => ({
      messages: messages.map((item) => {
        if (item.id === Number(tempId)) {
          return message;
        }
        return item;
      }),
    })),
  removeMessage: (messageId) =>
    set(({ messages, chats }) => {
      const lastMessage = messages.at(-1);
      const chatId = messages.find(
        (item) => item.id === Number(messageId),
      )?.course;

      return {
        messages: messages.filter((item) => item.id !== Number(messageId)),
        chats: chats.map((item) => {
          if (item.id === Number(chatId)) {
            return {
              ...item,
              last_message: lastMessage?.content || null,
              last_message_at: lastMessage?.created_at || null,
            };
          }
          return item;
        }),
      };
    }),
});
