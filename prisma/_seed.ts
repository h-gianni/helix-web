const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Existing job grades data
const jobGrades = [
  {
    level: 1,
    grade: 'A1',
    typicalResponsibilities: 'Entry level position with basic responsibilities'
  },
  {
    level: 2,
    grade: 'A2',
    typicalResponsibilities: 'Junior level position with developing responsibilities'
  },
  {
    level: 3,
    grade: 'A3',
    typicalResponsibilities: 'Experienced individual contributor'
  },
  {
    level: 4,
    grade: 'M1',
    typicalResponsibilities: 'Team lead or first-level management'
  },
  {
    level: 5,
    grade: 'M2',
    typicalResponsibilities: 'Mid-level management'
  },
  {
    level: 6,
    grade: 'M3',
    typicalResponsibilities: 'Senior management'
  },
  {
    level: 7,
    grade: 'D1',
    typicalResponsibilities: 'Director level'
  },
  {
    level: 8,
    grade: 'D2',
    typicalResponsibilities: 'Senior Director'
  },
  {
    level: 9,
    grade: 'D3',
    typicalResponsibilities: 'Executive Director'
  },
  {
    level: 10,
    grade: 'VP',
    typicalResponsibilities: 'Vice President'
  },
  {
    level: 11,
    grade: 'SVP',
    typicalResponsibilities: 'Senior Vice President'
  },
  {
    level: 12,
    grade: 'EVP',
    typicalResponsibilities: 'Executive Vice President'
  }
];

// Initial disciplines data
const disciplines = [
  {
    name: 'Product Design',
    description: 'User experience and interface design',
    jobTitles: [
      { name: 'UI Designer' },
      { name: 'UX Designer' },
      { name: 'Product Designer' },
      { name: 'UX Researcher' }
    ]
  },
  {
    name: 'Engineering',
    description: 'Software development and engineering',
    jobTitles: [
      { name: 'Frontend Developer' },
      { name: 'Backend Developer' },
      { name: 'Full Stack Developer' },
      { name: 'DevOps Engineer' }
    ]
  },
  {
    name: 'Product Management',
    description: 'Product strategy and execution',
    jobTitles: [
      { name: 'Product Manager' },
      { name: 'Product Owner' },
      { name: 'Technical Product Manager' }
    ]
  }
];

// Initial activities data
const activities = [
  {
    name: 'Technical Design',
    description: 'Creating technical specifications and architecture designs'
  },
  {
    name: 'Code Review',
    description: 'Reviewing and providing feedback on code submissions'
  },
  {
    name: 'Project Management',
    description: 'Managing project timelines, resources, and deliverables'
  },
  {
    name: 'Mentorship',
    description: 'Providing guidance and support to team members'
  },
  {
    name: 'Documentation',
    description: 'Creating and maintaining technical documentation'
  },
  {
    name: 'Workshop Facilitation',
    description: 'Planning and running team workshops'
  }
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data (optional - be careful with this in production!)
  await prisma.$executeRaw`TRUNCATE TABLE "Activity" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "JobTitle" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Discipline" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "JobGrade" CASCADE`;

  // Seed job grades
  console.log('Seeding job grades...');
  for (const data of jobGrades) {
    try {
      const result = await prisma.$queryRaw`
        INSERT INTO "JobGrade" (id, level, grade, "typicalResponsibilities", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${data.level}, ${data.grade}, ${data.typicalResponsibilities}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (level) DO UPDATE
        SET grade = ${data.grade},
            "typicalResponsibilities" = ${data.typicalResponsibilities},
            "updatedAt" = CURRENT_TIMESTAMP
        RETURNING level`;

      console.log(`Created/Updated job grade with level ${data.level}`);
    } catch (error) {
      console.error(`Error processing job grade level ${data.level}:`, error);
    }
  }

  // Seed disciplines and job titles
  console.log('Seeding disciplines and job titles...');
  for (const discipline of disciplines) {
    try {
      const createdDiscipline = await prisma.discipline.create({
        data: {
          name: discipline.name,
          description: discipline.description,
          jobTitles: {
            create: discipline.jobTitles
          }
        }
      });
      console.log(`Created discipline: ${discipline.name}`);
    } catch (error) {
      console.error(`Error creating discipline ${discipline.name}:`, error);
    }
  }

  // Seed activities
  console.log('Seeding activities...');
  for (const activity of activities) {
    try {
      const createdActivity = await prisma.activity.create({
        data: activity
      });
      console.log(`Created activity: ${activity.name}`);
    } catch (error) {
      console.error(`Error creating activity ${activity.name}:`, error);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });