import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://projectflow.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ProjectFlow',
    template: '%s | ProjectFlow',
  },
  description:
    'A full-stack project management dashboard — manage tasks, track progress, and collaborate with your team.',
  keywords: ['project management', 'task tracker', 'team collaboration', 'dashboard'],
  authors: [{ name: 'Muhammad Rizki' }],
  openGraph: {
    type: 'website',
    siteName: 'ProjectFlow',
    title: 'ProjectFlow — Project Management Dashboard',
    description:
      'Manage tasks, track progress, and collaborate with your team in one place.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProjectFlow — Project Management Dashboard',
    description:
      'Manage tasks, track progress, and collaborate with your team in one place.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
