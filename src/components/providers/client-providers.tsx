'use client'

import { LanguageProvider } from '@/contexts/language-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { QueryProvider } from '@/components/providers/query-provider'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
} 