import { prisma } from "../src/lib/prisma"

// Generates a new default event for tests 

async function seed() {
  await prisma.event.create({
    data: {
      id: 'e9acedb8-b295-4228-925a-7876e13785cd',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'Um evento para devs apaixonados por código.',
      maximumAttendees: 120
    }
  })
}

seed().then(() => {
  console.log('Database seeded')
  prisma.$disconnect()
})