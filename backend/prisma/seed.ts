import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'john_doe',
        password: hashedPassword,
        name: 'John Doe',
        reputation: 150
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        username: 'jane_smith',
        password: hashedPassword,
        name: 'Jane Smith',
        reputation: 200
      }
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        username: 'bob_wilson',
        password: hashedPassword,
        name: 'Bob Wilson',
        reputation: 75
      }
    })
  ]);

  console.log(`Created ${users.length} users`);

  // Create sample questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'How to handle async operations in JavaScript?',
        content: 'I\'m struggling with understanding async/await and promises. Can someone explain the differences and when to use each approach?',
        tags: ['javascript', 'async', 'promises'],
        authorId: users[0].id,
        views: 45
      }
    }),
    prisma.question.create({
      data: {
        title: 'Best practices for database design?',
        content: 'What are the key principles I should follow when designing a database schema? Looking for practical advice.',
        tags: ['database', 'design', 'best-practices'],
        authorId: users[1].id,
        views: 32
      }
    }),
    prisma.question.create({
      data: {
        title: 'React vs Vue.js - Which one to choose?',
        content: 'I\'m starting a new project and can\'t decide between React and Vue.js. What are the pros and cons of each?',
        tags: ['react', 'vue', 'frontend'],
        authorId: users[2].id,
        views: 78
      }
    }),
    prisma.question.create({
      data: {
        title: 'How to optimize SQL queries?',
        content: 'My application is running slow and I suspect it\'s due to inefficient SQL queries. What are some optimization techniques?',
        tags: ['sql', 'optimization', 'performance'],
        authorId: users[0].id,
        views: 23
      }
    })
  ]);

  console.log(`Created ${questions.length} questions`);

  // Create sample answers
  const answers = await Promise.all([
    prisma.answer.create({
      data: {
        content: 'Great question! Async/await is syntactic sugar over promises. Use async/await when you want to write asynchronous code that looks more like synchronous code. Promises are better when you need to handle multiple async operations or when working with older codebases.',
        authorId: users[1].id,
        questionId: questions[0].id
      }
    }),
    prisma.answer.create({
      data: {
        content: 'Here are some key principles: 1) Normalize your data to reduce redundancy, 2) Use appropriate data types, 3) Create proper indexes, 4) Define relationships correctly, 5) Consider performance early in the design process.',
        authorId: users[2].id,
        questionId: questions[1].id,
        isAccepted: true
      }
    }),
    prisma.answer.create({
      data: {
        content: 'Both are excellent choices! React has a larger ecosystem and job market, while Vue has a gentler learning curve and excellent documentation. Consider your team\'s experience and project requirements.',
        authorId: users[0].id,
        questionId: questions[2].id
      }
    }),
    prisma.answer.create({
      data: {
        content: 'SQL optimization tips: 1) Use indexes strategically, 2) Avoid SELECT *, 3) Use WHERE clauses to filter early, 4) Consider query execution plans, 5) Normalize your database structure.',
        authorId: users[1].id,
        questionId: questions[3].id
      }
    })
  ]);

  console.log(`Created ${answers.length} answers`);

  // Create sample votes
  const votes = await Promise.all([
    // Votes on questions
    prisma.vote.create({
      data: {
        value: 1,
        userId: users[1].id,
        questionId: questions[0].id
      }
    }),
    prisma.vote.create({
      data: {
        value: 1,
        userId: users[2].id,
        questionId: questions[0].id
      }
    }),
    prisma.vote.create({
      data: {
        value: 1,
        userId: users[0].id,
        questionId: questions[1].id
      }
    }),
    // Votes on answers
    prisma.vote.create({
      data: {
        value: 1,
        userId: users[0].id,
        answerId: answers[0].id
      }
    }),
    prisma.vote.create({
      data: {
        value: 1,
        userId: users[1].id,
        answerId: answers[2].id
      }
    })
  ]);

  console.log(`Created ${votes.length} votes`);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });