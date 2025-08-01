'use client'
import { getQueryClient } from '@/lib/get-query-client'
import { QueryClientProvider as QueryProvider } from '@tanstack/react-query'

export function QueryClientProvider({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  return <QueryProvider client={queryClient}>{children}</QueryProvider>
}
