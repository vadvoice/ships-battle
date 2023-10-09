import { ENV_VARS } from "@/libs/config";
import { Server } from "socket.io";

const onSocketConnection = (io, socket) => {
  const createdMessage = (msg) => {
    console.log("New message", msg);
    socket.broadcast.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: ENV_VARS.socketPath,
  });
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("New connection", socket.id);
    onSocketConnection(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Socket server started successfully!");
  res.end();
}
