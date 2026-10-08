import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import chatRoutes from './routes/chat';
import adminRoutes from './routes/admin';
import { authMiddleware } from './middleware/auth';
import { initSocket } from './socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

export const prisma = new PrismaClient();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Trust proxy (for reverse proxies like Nginx) - Adjust accordingly
app.set('trust proxy', 1);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/admin', authMiddleware, adminRoutes); // requireAdmin is inside adminRoutes

// Socket.IO
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
