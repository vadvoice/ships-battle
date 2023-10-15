import { ENV_VARS } from '@/libs/config';
import { Server } from 'socket.io';

const onSocketConnection = async (io, socket) => {
  socket.on('user_send_action', (gameState) => {
    console.log('user_send_action', gameState.role, gameState[gameState.role].stage);
    console.log('socket.rooms[0]:', socket.rooms, Array.from(socket.rooms).pop());
    socket.to('theName').emit('user_action', gameState);
  });

  socket.on('join_room', async (roomName) => {
    await socket.join(roomName);
    console.log(`user with id ${socket.id} joined room - ${roomName}`);
    const clients = await io.in(roomName).fetchSockets();
    if (clients.length >= 2) {
      io.sockets.in(roomName).emit('connection_successful', 'go!');
    }
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('user_disconnected', { id: socket.id, room });
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
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
