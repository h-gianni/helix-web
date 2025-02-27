// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { actionParentCategories as seedActivities  } from './seed-data/actions'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to seed categories and activities...')

  // Create categories and their activities
  for (const [key, categoryData] of Object.entries(seedActivities)) {
    console.log(`Creating category: ${categoryData.name}`)

    const category = await prisma.actionCategory.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
      },
    })

    // Create activities for this category
    for (const activityData of categoryData.subcategories) {
      console.log(`Creating activity: ${activityData.name}`)

      await prisma.action.upsert({
        where: { 
          name_categoryId: {
            name: activityData.name,
            categoryId: category.id
          }
        },
        update: {},
        create: {
          name: activityData.name,
          description: activityData.description,
          // impactScale: activityData.impactScale,
          categoryId: category.id,
        },
      })
    }
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error('Error while seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })