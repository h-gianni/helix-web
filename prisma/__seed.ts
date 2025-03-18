import { PrismaClient, SubscriptionTier } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Clean up existing data
  await cleanDatabase()

  // Create activity categories
  console.log('Creating activity categories...')
  const activityCategories = [
    {
      name: 'Development',
      description: 'Software development related activities'
    },
    {
      name: 'Leadership',
      description: 'Team leadership and management activities'
    },
    {
      name: 'Documentation',
      description: 'Documentation and knowledge sharing'
    },
    {
      name: 'Quality Assurance',
      description: 'Testing and quality control activities'
    }
  ]

  const createdCategories = await Promise.all(
    activityCategories.map(category =>
      prisma.actionCategory.create({
        data: category
      })
    )
  )

  // Create base activities
  console.log('Creating base activities...')
  const activities = [
    {
      name: 'Code Development',
      description: 'Writing and maintaining code',
      impactScale: 8,
      categoryId: createdCategories[0].id
    },
    {
      name: 'Code Review',
      description: 'Reviewing and providing feedback on code',
      impactScale: 7,
      categoryId: createdCategories[0].id
    },
    {
      name: 'Team Leadership',
      description: 'Leading and managing team activities',
      impactScale: 9,
      categoryId: createdCategories[1].id
    },
    {
      name: 'Technical Documentation',
      description: 'Creating and maintaining technical documentation',
      impactScale: 6,
      categoryId: createdCategories[2].id
    },
    {
      name: 'Testing',
      description: 'Writing and executing tests',
      impactScale: 7,
      categoryId: createdCategories[3].id
    }
  ]

  const createdActivities = await Promise.all(
    activities.map(activity =>
      prisma.action.create({
        data: activity
      })
    )
  )

  // Create job grades
  console.log('Creating job grades...')
  const jobGrades = [
    {
      level: 1,
      grade: 'JE1',
      typicalResponsibilities: 'Entry level engineer'
    },
    {
      level: 2,
      grade: 'JE2',
      typicalResponsibilities: 'Junior engineer with 1-2 years experience'
    },
    {
      level: 3,
      grade: 'SE1',
      typicalResponsibilities: 'Senior engineer with 3-5 years experience'
    },
    {
      level: 4,
      grade: 'SE2',
      typicalResponsibilities: 'Senior engineer with 5+ years experience'
    },
    {
      level: 5,
      grade: 'PE1',
      typicalResponsibilities: 'Principal engineer'
    }
  ]

  const createdJobGrades = await Promise.all(
    jobGrades.map(grade =>
      prisma.jobGrade.create({
        data: grade
      })
    )
  )

  // Create team functions and job titles
  console.log('Creating team functions and job titles...')
  const teamFunctions = [
    {
      name: 'Engineering',
      description: 'Software development and engineering',
      jobTitles: [
        'Software Engineer',
        'Senior Software Engineer',
        'Principal Engineer',
        'DevOps Engineer'
      ]
    },
    {
      name: 'Product',
      description: 'Product management and design',
      jobTitles: [
        'Product Manager',
        'Product Designer',
        'UX Researcher',
        'UI Designer'
      ]
    },
    {
      name: 'Quality Assurance',
      description: 'Testing and quality control',
      jobTitles: [
        'QA Engineer',
        'Test Automation Engineer',
        'Quality Lead'
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
            name: title,
            teamFunctionId: createdFunction.id
          }
        })
      )
    )
  }

  // Create sample users
  console.log('Creating sample users...')
  const users = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      subscriptionTier: SubscriptionTier.PREMIUM
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      subscriptionTier: SubscriptionTier.FREE
    }
  ]

  const createdUsers = await Promise.all(
    users.map(user =>
      prisma.appUser.create({
        data: user
      })
    )
  )

  // Create teams
  console.log('Creating teams...')
  const engineeringFunction = await prisma.teamFunction.findFirst({
    where: { name: 'Engineering' }
  })

  if (!engineeringFunction) {
    throw new Error('Engineering function not found')
  }

  const teams = [
    {
      name: 'Core Platform Team',
      description: 'Core platform development team',
      teamFunctionId: engineeringFunction.id,
      ownerId: createdUsers[0].id
    },
    {
      name: 'Mobile Development',
      description: 'Mobile app development team',
      teamFunctionId: engineeringFunction.id,
      ownerId: createdUsers[1].id
    }
  ]

  const createdTeams = await Promise.all(
    teams.map(team =>
      prisma.gTeam.create({
        data: team
      })
    )
  )

  // Create business activities
  console.log('Creating business activities...')
  for (const team of createdTeams) {
    await Promise.all(
      createdActivities.map(activity =>
        prisma.orgAction.create({
          data: {
            actionId: activity.id,
            // name: `${team.name} - ${activity.name}`,
            // description: activity.description,
            priority: 'MEDIUM',
            status: 'ACTIVE',
            teamId: team.id,
            createdBy: team.ownerId
          }
        })
      )
    )
  }

  // Create team members
  console.log('Creating team members...')
  for (const team of createdTeams) {
    await Promise.all(
      createdUsers.map(user =>
        prisma.teamMember.create({
          data: {
            userId: user.id,
            teamId: team.id,
            isAdmin: user.id === team.ownerId,
            status: 'ACTIVE',
            firstName: user.name?.split(' ')[0],
            lastName: user.name?.split(' ')[1],
            jobGradeId: createdJobGrades[Math.floor(Math.random() * createdJobGrades.length)].id,
            joinedDate: new Date()
          }
        })
      )
    )
  }

  console.log('Seeding complete!')
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