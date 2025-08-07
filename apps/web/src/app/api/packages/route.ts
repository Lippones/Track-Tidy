import { NextResponse } from 'next/server'
import { prisma } from '@workspace/prisma'

export async function GET() {
  const creditPackage = await prisma.creditPackage.findMany()

  return NextResponse.json({ creditPackage })
}
