import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function seed() {
  const packages = [
    {
      name: 'Starter Vibes',
      description: 'Ideal para testar o app e criar sua primeira playlist.',
      credits: 100,
      price: 100 // US$1.00 (em centavos)
    },
    {
      name: 'Music Lover',
      description: 'Perfeito para criar várias playlists incríveis.',
      credits: 500,
      price: 450 // US$4.50 (10% de desconto)
    },
    {
      name: 'DJ Pro',
      description: 'Para quem quer organizar playlists como um pro.',
      credits: 1000,
      price: 850 // US$8.50 (15% de desconto)
    },
    {
      name: 'Festival Bundle',
      description: 'Organize playlists épicas para festivais inteiros!',
      credits: 2500,
      price: 2000 // US$20.00 (20% de desconto)
    }
  ]

  for (const pkg of packages) {
    await prisma.creditPackage.upsert({
      where: { name: pkg.name },
      update: {
        description: pkg.description,
        credits: pkg.credits,
        price: pkg.price,
        updatedAt: new Date()
      },
      create: {
        name: pkg.name,
        description: pkg.description,
        credits: pkg.credits,
        price: pkg.price
      }
    })
    console.log(`Pacote ${pkg.name} criado ou atualizado.`)
  }

  console.log('Database seeded')
  await prisma.$disconnect()
}

seed().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
