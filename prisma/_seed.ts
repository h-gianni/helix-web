// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { actionParentCategories } from './seed-data/actions';

const prisma = new PrismaClient();

// async function cleanupBeforeSeed() {
//   // Only use this in development environment
//   if (process.env.NODE_ENV === 'production') {
//     console.log('Skipping cleanup in production environment');
//     return;
//   }

//   try {
//     // Delete existing records in reverse order of dependencies
//     await prisma.action.deleteMany({});
//     await prisma.actionCategory.deleteMany({});
//     console.log('Previous seed data cleaned up successfully');
//   } catch (error) {
//     console.error('Error during cleanup:', error);
//     // Continue with seeding even if cleanup fails
//   }
// }

// async function seedActionCategories() {
//   console.log('Seeding action categories...');
  
//   // Map to store created category IDs by name for reference
//   const categoryMap = new Map();
  
//   // First pass: Create all parent categories
//   for (const parentCategory of actionParentCategories) {
//     try {
//       const parentCat = await prisma.actionCategory.create({
//         data: {
//           name: parentCategory.name,
//           description: parentCategory.description,
//           // key: parentCategory.name.toLowerCase().replace(/\s+/g, '-'),
//         }
//       });
      
//       categoryMap.set(parentCategory.name, parentCat.id);
//       console.log(`Created parent category: ${parentCat.name} (ID: ${parentCat.id})`);
//     } catch (error) {
//       console.error(`Error creating parent category ${parentCategory.name}:`, error);
//     }
//   }
  
//   // Second pass: Create subcategories with parentId references
//   for (const parentCategory of actionParentCategories) {
//     const parentId = categoryMap.get(parentCategory.name);
    
//     if (!parentId) {
//       console.error(`Parent category ID not found for ${parentCategory.name}, skipping subcategories`);
//       continue;
//     }
    
//     for (const subCategory of parentCategory.subcategories) {
//       try {
//         const subCat = await prisma.actionCategory.create({
//           data: {
//             name: subCategory.name,
//             description: subCategory.description,
//             // key: subCategory.key,
//             // parentId: parentId
//           }
//         });
        
//         categoryMap.set(`${parentCategory.name}:${subCategory.name}`, subCat.id);
//         console.log(`Created subcategory: ${subCat.name} under ${parentCategory.name}`);
        
//         // Create actions for this subcategory
//         await seedActionsForCategory(subCat.id, subCategory.actions);
//       } catch (error) {
//         console.error(`Error creating subcategory ${subCategory.name}:`, error);
//       }
//     }
//   }
  
//   return categoryMap;
// }

// async function seedActionsForCategory(categoryId:string, actions:string) {
//   for (const actionItem of actions) {
//     try {
//       const action = await prisma.action.create({
//         data: {
//           name: actionItem.name,
//           description: actionItem.description,
//           impactScale: actionItem.impactScale,
//           categoryId: categoryId
//         }
//       });
      
//       console.log(`Created action: ${action.name}`);
//     } catch (error) {
//       console.error(`Error creating action ${actionItem.name}:`, error);
//     }
//   }
// }

// async function main() {
//   try {
//     // Optionally clean up existing data first
//     await cleanupBeforeSeed();
    
//     // Run the seed operations in a transaction
//     await prisma.$transaction(async (tx) => {
//       await seedActionCategories();
//     });
    
//     console.log('Seeding completed successfully');
//   } catch (error) {
//     console.error('Transaction failed. Error seeding database:', error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main().catch((e) => {
//   console.error('Unhandled error during seeding:', e);
//   process.exit(1);
// });