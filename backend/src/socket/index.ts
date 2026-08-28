import { Server, Socket } from "socket.io";
import ApiError from "../utils/ApiError";
import { ChatEventEnum } from "../utils/constants";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isAuthPayload } from "../utils/checkPayload";
import { io } from "../app";

let onlineUsers: string[] = [];

// const typingStartedEvent = (socket: Socket) => {
//   socket.on(ChatEventEnum.TYPING_STARTED, ({ chatId, userId }) => {
//     console.log(`Typing started in ${chatId} by`, userId);
//     socket.in(userId).emit(ChatEventEnum.TYPING_STARTED, { chatId, userId });
//   });
// };

// const typingEndedEvent = (socket: Socket) => {
//   socket.on(ChatEventEnum.TYPING_ENDED, ({ chatId, userId }) => {
//     console.log(`Typing ended in ${chatId} by`, userId);
//     socket.in(userId).emit(ChatEventEnum.TYPING_ENDED, { chatId, userId });
//   });
// };

const initializeSocket = (io: Server) => {
  return io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.headers.authorization?.replace(
        "Bearer ",
        "",
      );
      if (!token) {
        throw new ApiError(401, "Unauthorized handshake, token not found");
      }

      const decodedToken = (await jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      )) as JwtPayload;

      if (!decodedToken) {
        throw new ApiError(401, "Unauthorized handshake, invalid token");
      }

      if (!isAuthPayload(decodedToken)) {
        throw new ApiError(500, "Unauthorized handshake, invalid payload");
      }

      socket.user = decodedToken;
      socket.join(decodedToken.id.toString());

      console.log("User connected, userId", decodedToken.id);

      // typingStartedEvent();
      // typingEndedEvent();

      socket.on(ChatEventEnum.USER_DISCONNECTED, () => {
        console.log("User disconnected, userId:", socket.user?.id);
        onlineUsers.filter((item) => item !== socket.user?.id.toString());
        if (socket.user?.id) socket.leave(socket.user.id.toString());
        io.emit(ChatEventEnum.ONLINE_USERS, onlineUsers);
      });

      socket.on(ChatEventEnum.USER_OFFLINE, () => {
        console.log("User disconnected, userId", socket.user?.id);
        onlineUsers.filter((item) => item !== socket.user?.id.toString());
        if (socket.user?.id) socket.leave(socket.user.id.toString());
        io.emit(ChatEventEnum.ONLINE_USERS, onlineUsers);
      });
    } catch (error) {
      let message = "Something went wrong";
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      socket.emit(ChatEventEnum.SOCKET_ERROR, message);
      socket.disconnect();
    }
  });
};

export const emitSocketEvent = (roomId: string, event: string, payload: any) => {
  io.in(roomId).emit(event, payload);
};

export default initializeSocket;
