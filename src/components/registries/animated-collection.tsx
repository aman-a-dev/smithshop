'use client'

import { motion, LayoutGroup } from 'motion/react'
import { LayoutGrid, LayoutList, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'grid' | 'list' | 'pack'
type ViewsType = { id: ViewMode; icon: React.ElementType; label: string }
const VIEWS: ViewsType[] = [
  { id: 'grid', icon: LayoutGrid, label: 'Grid' },
  { id: 'list', icon: LayoutList, label: 'List' },
  { id: 'pack', icon: Layers, label: 'Pack' },
]

export const spring = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 30,
  mass: 1,
}

export default function AnimatedCollection({
  view,
  onViewChange,
}: {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}) {
  return (
    <div className="flex p-1 bg-muted rounded-full w-fit border border-border/50">
      {VIEWS.map(v => {
        const active = view === v.id
        const Icon = v.icon
        return (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase transition-all rounded-full outline-none',
              active
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {active && (
              <motion.div
                layoutId="view-bubble"
                className="absolute inset-0 bg-primary rounded-full shadow-md"
                transition={spring}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{v.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}