import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

const hashed = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create admin data
  await prisma.users.upsert({
    where: { email: 'admin@etap.com' },
    update: {},
    create: {
      email: 'admin@etap.com',
      firstName: 'Emma',
      lastName: 'Alli',
      phone: '08100581440',
      role: 'admin',
      password: hashed,
    },
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
