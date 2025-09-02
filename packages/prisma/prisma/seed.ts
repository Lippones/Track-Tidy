import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function seed() {
  await prisma.creditPackage.createMany({
    data: [
      {
        name: 'Starter',
        description: 'Pacote inicial',
        credits: 33,
        price: 2900 // 29.00 in cents
      },
      {
        name: 'Plus',
        description: 'Pacote mais popular',
        credits: 75,
        price: 5900 // 59.00 in cents
      },
      {
        name: 'Pro',
        description: 'Para heavy users',
        credits: 160,
        price: 11900 // 119.00 in cents
      }
    ],
    skipDuplicates: true
  })

  console.log('Database seeded')
  await prisma.$disconnect()
}

seed().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
