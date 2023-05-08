// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

const prisma  = new PrismaClient();

const fakerUser = (): any => {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.internet.email(firstname, lastname);
    const password = bcrypt.hashSync('password', 10);
    return { firstname, lastname, email, password };
};

async function main() {
const fakerRounds = 10;
dotenv.config();
console.log('Seeding...');
/// --------- Users ---------------
for (let i = 0; i < fakerRounds; i++) {
await prisma.user.create({ data: fakerUser() });
}
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })