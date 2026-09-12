import { io } from "socket.io-client";

const URL = import.meta.env.VITE_APP_BACKEND_URL
  ? undefined
  : "http://localhost:3000";

export const socket = io(URL);
