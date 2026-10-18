import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  const adminPassword = await bcrypt.hash("admin123", 10);
  const user1Password = await bcrypt.hash("user123", 10);
  const user2Password = await bcrypt.hash("user456", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      username: "Admin",
      passwordHash: adminPassword,
      role: "admin",
      createdAt: new Date(),
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      username: "John",
      passwordHash: user1Password,
      role: "user",
      createdAt: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      username: "Sarah",
      passwordHash: user2Password,
      role: "user",
      createdAt: new Date(),
    },
  });

  await prisma.post.createMany({
    data: [
      // Admin posts
      {
        title: "Welcome to My Blog",
        content: "This is the first post written by the admin.",
        published: true,
        authorId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Building a Fullstack Blog",
        content: "This blog is built with React, Express, Prisma, and SQLite.",
        published: true,
        authorId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Admin Draft",
        content: "This is an unpublished post created by the admin.",
        published: false,
        authorId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // User 1 posts
      {
        title: "My First Post",
        content: "This is the first post written by John.",
        published: true,
        authorId: user1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Learning React",
        content: "I am learning React and building interesting projects.",
        published: true,
        authorId: user1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "My React Draft",
        content: "This is an unpublished draft written by John.",
        published: false,
        authorId: user1.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // User 2 posts
      {
        title: "Getting Started",
        content: "This is Sarah's first post on the blog.",
        published: true,
        authorId: user2.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Learning TypeScript",
        content: "TypeScript makes working with JavaScript much easier.",
        published: true,
        authorId: user2.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "My Draft Post",
        content: "This is an unpublished draft written by Sarah.",
        published: false,
        authorId: user2.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });