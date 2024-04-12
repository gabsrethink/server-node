import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "3310c77f-5702-4bbb-8ed0-77f811287f82",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "Evento para quem gosta de programação",
      maximumAttendees: 10,
    },
  });
}

seed().then(() => {
  console.log("Database seeded!");
  prisma.$disconnect();
});
