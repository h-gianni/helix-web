import { PrismaClient } from '@prisma/client'
import {PrismaNeon} from '@prisma/adapter-neon'
import {Pool} from '@neondatabase/serverless'


const PrismaClientSingleton = ()=>{
    const connectionString = `${process.env.DATABASE_URL}`
    const pool = new Pool({
        connectionString
    })
    const adapter = new PrismaNeon(pool)

    const prisma = new PrismaClient({adapter})
    return prisma
}

// Prevent multiple instances of Prisma Client in development
declare const globalThis: {
    prismaGLobal: ReturnType<typeof PrismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGLobal ?? PrismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGLobal = prisma