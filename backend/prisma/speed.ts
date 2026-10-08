import { PrismaClient, Role, AccountType } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPass = process.env.ADMIN_PASSWORD || '122';
  const specialPass = process.env.SPECIAL_PASSWORD || '1234';

  // Seed Admin
  await prisma.user.upsert({
    where: { username: 'ellnihbous' },
    update: {},
    create: {
      username: 'ellnihbous',
      displayName: 'Ell',
      passwordHash: await argon2.hash(adminPass),
      role: Role.ADMIN,
      accountType: AccountType.HUMAN,
    },
  });

  // Seed Special User
  await prisma.user.upsert({
    where: { username: 'Salmaa' },
    update: {},
    create: {
      username: 'Salmaa',
      displayName: 'Salma',
      passwordHash: await argon2.hash(specialPass),
      role: Role.USER,
      accountType: AccountType.HUMAN,
    },
  });

  // Seed Helper Bot
  await prisma.user.upsert({
    where: { username: 'helper_bot' },
    update: {},
    create: {
      username: 'helper_bot',
      displayName: 'Helper Bot',
      passwordHash: await argon2.hash('bot_secure_password_!@#'),
      accountType: AccountType.BOT,
    },
  });

  // Seed Announcement Bot
  await prisma.user.upsert({
    where: { username: 'announcement_bot' },
    update: {},
    create: {
      username: 'announcement_bot',
      displayName: 'Announcement Bot',
      passwordHash: await argon2.hash('bot_secure_password_!@#'),
      accountType: AccountType.BOT,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
