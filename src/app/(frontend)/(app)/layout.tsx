import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuth()
  if (!user || user.collection !== 'users') redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
