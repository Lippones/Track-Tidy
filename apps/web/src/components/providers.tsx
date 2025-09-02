import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@workspace/ui/components/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <QueryClientProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  )
}
