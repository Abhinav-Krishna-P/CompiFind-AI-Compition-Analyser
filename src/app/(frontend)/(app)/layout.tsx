import { AppSidebar } from '@/components/app-sidebar'

// Route protection is handled by middleware (src/middleware.ts).
// Actual auth is verified per-page via getAuth() inside Suspense boundaries.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
