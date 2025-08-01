import { z } from 'zod'
import { NextResponse } from 'next/server'
import { auth } from '@workspace/auth'
import { prisma } from '@workspace/prisma'

const querySchema = z.object({
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val) : val),
    z.number().min(1, 'Page number must be at least 1')
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val) : val),
    z
      .number()
      .min(1, 'Limit must be at least 1')
      .max(20, 'Limit cannot exceed 20')
  )
})

export async function GET(request: Request) {
  try {
    // Autenticar usuário (ajuste para sua implementação)
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)

    const parseResult = querySchema.safeParse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit')
    })

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { page, limit } = parseResult.data

    const jobs = await prisma.playlistJob.findMany({
      where: { userId: session.user.id },
      include: { playlistJobResults: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error in /api/playlist-jobs:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
