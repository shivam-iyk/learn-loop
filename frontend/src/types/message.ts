import type { CourseSlice } from "./course";

export interface Message {
  id: number;
  name: string;
  avatar: string | null;
  content: string;
  course: number;
  role: "instructor" | "student";
  attachment: null | {
    type: "image" | "video" | "audio" | "document";
    url: string;
  };
  created_at: string;
  sender: number;
  isLoading?: boolean;
  reply?: string | null;
  reply_by?: string | null;
}

export interface MessagePage {
  pagination: CourseSlice["pagination"];
  messages: Message[];
}

export type MessageReply = {
  name: string;
  content: string;
} | null;

export interface Chat {
  id: number;
  name: string;
  cover: string;
  tagline: string;
  last_message: string | null;
  last_message_at: string | null;
}

export interface MessageSlice {
  chats: Chat[];
  messages: Message[];
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message, tempId: string | number) => void;
  removeMessage: (messageId: string | number) => void;
}
