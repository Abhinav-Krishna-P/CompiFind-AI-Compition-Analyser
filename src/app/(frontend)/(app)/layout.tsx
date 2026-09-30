import { Suspense } from 'react'
import { AppSidebar } from '@/components/app-sidebar'

// Route protection is handled by proxy.ts.
// The sidebar uses usePathname() (client hook) which requires Suspense during prerendering.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Suspense fallback={
        <div className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border" />
      }>
        <AppSidebar />
      </Suspense>
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
