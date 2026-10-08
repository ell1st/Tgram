import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../index';
import { io } from '../socket';

const router = Router();

router.post('/:id/messages', async (req: AuthRequest, res: Response) => {
  const { id: conversationId } = req.params;
  const { content, type } = req.body;
  const sender = req.user;

  const member = await prisma.conversationMember.findUnique({ where: { conversationId_userId: { conversationId, userId: sender.id } } });
  if (!member) return res.status(403).json({ success: false, message: 'Not a member' });

  // Check if it's a Private Chat with Helper Bot
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId }, include: { members: true } });
  const botMember = conv?.members.find(m => m.userId !== sender.id);
  
  if (botMember) {
    const botUser = await prisma.user.findUnique({ where: { id: botMember.userId } });
    
    if (botUser?.username === 'helper_bot' && sender.role === 'ADMIN' && content.startsWith('/')) {
      // Handle Bot Commands
      const args = content.split(' ');
      const command = args[0];
      
      if (command === '/ban') {
        const targetUsername = args[1];
        const target = await prisma.user.findUnique({ where: { username: targetUsername } });
        if (target) {
          await prisma.user.update({ where: { id: target.id }, data: { isBanned: true } });
          await prisma.bannedIP.create({ data: { userId: target.id, ipAddress: '0.0.0.0', reason: `Banned by ${sender.username}` } });
          await prisma.message.create({ data: { conversationId, content: `User ${targetUsername} has been banned.`, type: 'SYSTEM' } });
          return res.json({ success: true, message: 'Command executed' });
        }
      }
      // /unban, /alluser logic goes here...
    }
  }

  // Normal Message
  const message = await prisma.message.create({
    data: { senderId: sender.id, conversationId, content, type },
    include: { sender: true }
  });

  io.to(conversationId).emit('newMessage', message);
  res.json({ success: true, message });
});

export default router;
