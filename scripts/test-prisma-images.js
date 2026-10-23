const { prisma } = require('../src/lib/db');

async function testPrisma() {
  const prods = await prisma.product.findMany({
    where: { isPublished: true, isNewArrival: true },
    include: { images: true, variants: true },
    take: 3,
  });
  console.log('Prisma products findMany count:', prods.length);
  for (const p of prods) {
    console.log('Product:', p.id, p.name);
    console.log('Images array:', p.images);
  }
}

testPrisma();
