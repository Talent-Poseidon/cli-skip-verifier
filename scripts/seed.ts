const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('adminpassword', 10);

  // Original Admin (preserve existing logic)
  const originalAdmin = await prisma.user.upsert({
    where: { email: 'admin@monster.com' },
    update: {
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@monster.com',
      name: 'Admin Monster',
      password: adminPassword,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test Admin (for E2E tests)
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password,
      role: 'admin',
      is_approved: true,
    },
    create: {
      email: 'admin@example.com',
      name: 'Test Admin',
      password,
      role: 'admin',
      is_approved: true,
    },
  });

  // Test User (for E2E tests)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password,
      role: 'user',
      is_approved: true,
    },
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password,
      role: 'user',
      is_approved: true,
    },
  });

  // Seed project for E2E tests
  const seedProject = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'Seed Project Alpha',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
    },
  });

  // Seed competency dictionary for E2E tests
  const seedCompetencyDictionary = await prisma.competencyDictionary.upsert({
    where: { id: 'seed-competency-dict-1' },
    update: {},
    create: {
      id: 'seed-competency-dict-1',
      name: 'Seed Competency Template',
      fileName: 'seed-template.xlsx',
      fileUrl: '/uploads/seed-template.xlsx',
    },
  });

  // Seed job standard for E2E tests
  const seedJobStandard = await prisma.jobStandard.upsert({
    where: { id: 'seed-job-standard-1' },
    update: {},
    create: {
      id: 'seed-job-standard-1',
      jobTitle: 'Seed Software Engineer',
      scoreExpectation: 85.0,
    },
  });

  // Seed scenario for E2E tests
  const seedScenario = await prisma.scenario.upsert({
    where: { id: 'seed-scenario-1' },
    update: {},
    create: {
      id: 'seed-scenario-1',
      name: 'Seed Exam Scenario',
      description: 'A seeded scenario for E2E testing',
    },
  });

  console.log({ originalAdmin, testAdmin, testUser, seedProject, seedCompetencyDictionary, seedJobStandard, seedScenario });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
