// Coarse session check for UX redirects from layouts.
// NOT a security boundary — session + permissions are enforced in every
// protected Server Component and Server Action via lib/session.ts.
export { requireSession as redirectIfUnauthenticated } from '@/lib/session'
