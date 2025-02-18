import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { APIError } from './errors'
import { ZodError } from 'zod'

type RouteHandler = (
  req: Request,
  params: { params: Record<string, string> }
) => Promise<NextResponse> | NextResponse

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, params) => {
    try {
      return await handler(req, params)
    } catch (error) {
      console.error('API Error:', error)

      // Handle known errors
      if (error instanceof APIError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: error.code
          },
          { status: error.statusCode }
        )
      }

      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            return NextResponse.json(
              {
                success: false,
                error: 'A record with this value already exists.',
                code: 'DUPLICATE_ERROR'
              },
              { status: 400 }
            )
          case 'P2025':
            return NextResponse.json(
              {
                success: false,
                error: 'Record not found.',
                code: 'NOT_FOUND'
              },
              { status: 404 }
            )
          default:
            console.error('Prisma Error:', {
              code: error.code,
              message: error.message
            })
        }
      }

      // Handle validation errors (e.g., from Zod)
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            details: error.errors,
            code: 'VALIDATION_ERROR'
          },
          { status: 400 }
        )
      }


      // Handle unknown errors
      return NextResponse.json(
        {
          success: false,
          error: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR'
        },
        { status: 500 }
      )
    }
  }
}
