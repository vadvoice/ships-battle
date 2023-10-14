import { ENV_VARS } from '@/libs/config';
import { Server } from 'socket.io';
// TOOD: redo...
let connectionCounter = 0;

const onSocketConnection = async (io, socket) => {
  const createdMessage = (msg) => {
    console.log('New message', msg);
    socket.broadcast.emit('newIncomingMessage', msg);
  };

  socket.on('createdMessage', createdMessage);

  socket.on('join_room', async (roomName) => {
    await socket.join(roomName);
    console.log(`user with id ${socket.id} joined room - ${roomName}`);
    // const clients = io.sockets.clients(roomName);
    connectionCounter++;
    console.log('connectionCounter', connectionCounter);
    const clients = await io.in(roomName).fetchSockets()
    if (clients.length >= 2) {
      // socket.broadcast.emit('connection_successful', 'go!');
      socket.to(roomName).emit("connection_successful", 'go!');
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Server already started!');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: ENV_VARS.socketPath,
  });
  res.socket.server.io = io;

  const onConnection = async (socket) => {
    console.log('New connection', socket.id);
    onSocketConnection(io, socket);
  };

  io.on('connection', onConnection);

  console.log('Socket server started successfully!');
  res.end();
}
