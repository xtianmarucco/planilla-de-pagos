import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const users = [
  { name: 'Julio',             email: 'julio@biavana.com',      password: 'julioviabana'   },
  { name: 'Florencia Garcia',  email: 'flor@mayorista.com',     password: 'florcita'       },
  { name: 'Christian Marucco', email: 'christian@mayorista.com', password: 'titimayorista' },
  { name: 'Noel Caric',        email: 'noelcaric@hotmail.com',  password: 'titipagos'      },
];

async function main() {
  for (const { name, email, password } of users) {
    const exists = await prisma.users.findUnique({ where: { email } });
    if (exists) {
      console.log(`skip: ${email} already exists`);
      continue;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.users.create({ data: { name, email, password_hash } });
    console.log(`created: ${email}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
