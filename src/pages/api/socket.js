import { ENV_VARS } from '@/libs/config';
import { Server } from 'socket.io';

const onSocketConnection = async (io, socket) => {
  socket.on('user_send_planning_action', (gameState) => {
    socket.to(Array.from(socket.rooms).pop()).emit('user_action_planning_change', gameState);
  });

  socket.on('user_send_battle_action', (gameState) => {
    socket.to(Array.from(socket.rooms).pop()).emit('user_action_combat_log', gameState);
  });

  socket.on('room_connection_request', async (roomName) => {
    await socket.join(roomName);
    console.log(`user with id ${socket.id} joined room - ${roomName}`);
    const clients = await io.in(roomName).fetchSockets();
    if (clients.length >= 2) {
      io.sockets.in(roomName).emit('room_user_connected', 'go!');
    }
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('room_user_disconnected', { id: socket.id, room });
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
};

export default function handler(req, res) {
  if (res.socket.server.io) {
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
