import { prisma } from './index';

async function main() {
  const post = await prisma.article.upsert({
    where: { title: "what's new in Prisma" },
    update: {},
    create: {
      title: 'ooo',
      body: 'www',
      description: 'rrr',
      published: true,
    },
  });
  console.log(post);
}
main()
  .catch((err) => console.log(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
