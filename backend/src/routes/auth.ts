import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const ip = req.ip;

  // 1. Check IP Ban
  const ipBan = await prisma.bannedIP.findFirst({ where: { ipAddress: ip, unbannedAt: null } });
  if (ipBan) return res.status(403).json({ success: false, message: 'Access denied' });

  // 2. Find User
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.accountType === 'BOT') return res.status(400).json({ success: false, message: 'Invalid credentials' });

  // 3. Check User Ban
  if (user.isBanned) return res.status(403).json({ success: false, message: 'Account suspended' });

  // 4. Verify Password
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) return res.status(400).json({ success: false, message: 'Invalid credentials' });

  // 5. Create Session & JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await prisma.session.create({ data: { userId: user.id, token, expiresAt } });

  res.json({ success: true, token, user: { id: user.id, username: user.username, displayName: user.displayName, role: user.role, profilePicture: user.profilePicture } });
});

export default router;
