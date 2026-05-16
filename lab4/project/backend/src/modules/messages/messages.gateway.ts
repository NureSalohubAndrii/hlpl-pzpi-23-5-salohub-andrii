import { Server, Socket } from 'socket.io';
import { verifyToken } from '../../shared/utils/auth.util';
import { sendMessage } from './messages.service';

export const initSocketGateway = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded || typeof decoded === 'string') {
      return next(new Error('Invalid token'));
    }

    (socket as any).userId = decoded.userId;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string;
    console.log(`User connected: ${userId}`);

    socket.join(`user:${userId}`);

    socket.on(
      'send_message',
      async (data: { receiverId: string; content: string }) => {
        const { receiverId, content } = data;

        if (!receiverId || !content?.trim()) {
          return;
        }

        try {
          const message = await sendMessage(userId, receiverId, content.trim());

          io.to(`user:${receiverId}`).emit('new_message', message);
          io.to(`user:${userId}`).emit('new_message', message);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};
