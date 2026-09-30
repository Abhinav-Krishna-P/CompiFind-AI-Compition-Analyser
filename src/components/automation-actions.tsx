'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleAutomationAction, deleteAutomationAction, runAutomationNowAction } from '@/actions/automations.actions'
import { Button } from '@/components/ui/button'
import { Play, Pause, Trash2, Loader2, Zap } from 'lucide-react'

export function ToggleAutomationButton({ automationId, status }: { automationId: string; status: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await toggleAutomationAction(automationId)
        router.refresh()
      })}
    >
      {isPending
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : status === 'active'
          ? <><Pause className="h-4 w-4 mr-1" />Pause</>
          : <><Play className="h-4 w-4 mr-1" />Resume</>
      }
    </Button>
  )
}

export function RunNowButton({ automationId }: { automationId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await runAutomationNowAction(automationId)
        router.refresh()
      })}
    >
      {isPending
        ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
        : <Zap className="h-4 w-4 mr-1" />
      }
      {isPending ? 'Queuing...' : 'Run Now'}
    </Button>
  )
}

export function DeleteAutomationButton({ automationId }: { automationId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm('Delete this automation?')) return
        startTransition(async () => {
          await deleteAutomationAction(automationId)
          router.refresh()
        })
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
