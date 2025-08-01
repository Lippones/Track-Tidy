import { defineConfig } from '@trigger.dev/sdk/v3'
import { prismaExtension } from '@trigger.dev/build/extensions/prisma'
import { additionalPackages } from '@trigger.dev/build/extensions/core'

export default defineConfig({
  project: 'proj_lgnoqylseptvaqsujvvk',
  enableConsoleLogging: true,
  retries: {
    enabledInDev: true
  },
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 3600, // 1 hour
  build: {
    extensions: [
      additionalPackages({
        packages: ['@prisma/client', 'prisma', 'zod-prisma-types']
      }),
      prismaExtension({
        version: '6.7.0',
        schema: '../prisma/prisma/schema.prisma'
      })
    ]
  },
  dirs: ['./src/trigger']
})
