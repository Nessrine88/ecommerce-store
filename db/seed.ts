import { PrismaClient, Prisma } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import sampleData from './sample-data'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products.map((product) => ({
      ...product,
      price: new Prisma.Decimal(product.price),
    })),
  })
await prisma.user.createMany({
data: sampleData.users
})
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })