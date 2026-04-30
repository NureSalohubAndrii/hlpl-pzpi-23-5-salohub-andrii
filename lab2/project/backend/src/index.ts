import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config';
import cookieParser from 'cookie-parser';
import usersRoutes from './modules/users/users.routes';
import authRoutes from './modules/auth/auth.routes';
import messagesRoutes from './modules/messages/messages.routes';
import postsRoutes from './modules/posts/posts.routes';
import commentsRoutes from './modules/comments/comments.routes';
import friendsRoutes from './modules/friends/friends.routes';
import http from 'http';
import compression from 'compression';
import { Server } from 'socket.io';
import { initSocketGateway } from './modules/messages/messages.gateway';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_END_URL_DEV,
    credentials: true,
    allowedHeaders: [
      'authorization',
      'set-cookie',
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
  },
});

app.use(
  cors({
    origin: process.env.FRONT_END_URL_DEV,
    credentials: true,
    allowedHeaders: [
      'authorization',
      'set-cookie',
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
  })
);

app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/friends', friendsRoutes);

initSocketGateway(io);

const PORT = parseInt(process.env.PORT || '10000', 10);
const HOST = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
