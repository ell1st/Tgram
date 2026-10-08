import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

export const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
      if (!session || session.user.isBanned) return next(new Error('Auth error'));
      socket.data.user = session.user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    onlineUsers.set(user.id, socket.id);
    io.emit('userStatus', { userId: user.id, status: 'ONLINE' });

    socket.on('joinConversation', (convId: string) => socket.join(convId));
    socket.on('typing', (convId: string) => socket.to(convId).emit('userTyping', { userId: user.id, convId }));

    socket.on('disconnect', () => {
      onlineUsers.delete(user.id);
      io.emit('userStatus', { userId: user.id, status: 'OFFLINE' });
    });
  });
};
