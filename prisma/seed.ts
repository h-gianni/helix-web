import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Clean up existing data
  await cleanDatabase()

  // Create job grades
  console.log('Creating job grades...')
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
  ]

  const createdJobGrades = await Promise.all(
    jobGrades.map(grade =>
      prisma.jobGrade.create({
        data: grade
      })
    )
  )
  console.log(`Created ${createdJobGrades.length} job grades`)

  // Create team functions and job titles
  console.log('Creating team functions and job titles...')
  const teamFunctions = [
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
  ]

  for (const func of teamFunctions) {
    const createdFunction = await prisma.teamFunction.create({
      data: {
        name: func.name,
        description: func.description
      }
    })

    await Promise.all(
      func.jobTitles.map(title =>
        prisma.jobTitle.create({
          data: {
            name: title.name,
            teamFunctionId: createdFunction.id
          }
        })
      )
    )
  }
  console.log(`Created ${teamFunctions.length} team functions with their job titles`)

  // Create a sample user for activities
  console.log('Creating sample user...')
  const sampleUser = await prisma.appUser.create({
    data: {
      email: 'admin@example.com',
      name: 'System Admin'
    }
  })

  // Create a sample team
  console.log('Creating sample team...')
  const engineeringFunction = await prisma.teamFunction.findFirst({
    where: { name: 'Engineering' }
  })

  if (!engineeringFunction) {
    throw new Error('Engineering function not found')
  }

  const sampleTeam = await prisma.gTeam.create({
    data: {
      name: 'Core Team',
      description: 'Main development team',
      teamFunctionId: engineeringFunction.id,
      ownerId: sampleUser.id
    }
  })

  // Create business activities
  console.log('Creating business activities...')
  const businessActivities = [
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
  ]

  await Promise.all(
    businessActivities.map(activity =>
      prisma.businessActivity.create({
        data: {
          name: activity.name,
          description: activity.description,
          teamId: sampleTeam.id,
          createdBy: sampleUser.id,
          status: 'ACTIVE',
          priority: 'MEDIUM'
        }
      })
    )
  )
  console.log(`Created ${businessActivities.length} business activities`)

  console.log('Seeding finished.')
}

async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations')
    .map(name => `"public"."${name}"`)
    .join(', ')

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    }
  } catch (error) {
    console.log('Error cleaning database:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })