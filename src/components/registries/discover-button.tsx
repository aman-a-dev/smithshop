'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search, X, Flame, Star, Grid2x2, Gamepad2,
  Smartphone, Zap, Trophy, Users, Music, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { productsList } from '@/data/products-list'

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'free-fire': Flame,
  'roblox': Star,
  'pubg-mobile': Trophy,
  'call-of-duty': Zap,
  'blood-strike': Gamepad2,
  'efootball': Trophy,
  'instagram': Users,
  'tiktok': Music,
  'telegram': Smartphone,
}

const CATEGORY_TABS = productsList.categories.map(c => ({
  id: c.id,
  label: c.name,
  Icon: CATEGORY_ICON_MAP[c.id] ?? Grid2x2,
}))

const spring = { type: 'spring' as const, damping: 20, stiffness: 230, mass: 1.2 }

export default function DiscoverButton({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: {
  activeCategory: string
  onCategoryChange: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  function openSearch() {
    setIsExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  function closeSearch() {
    setIsExpanded(false)
    onSearchChange('')
    inputRef.current?.blur()
  }

  function scrollTabs(dir: 'left' | 'right') {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' })
  }

  return (
    <div className="w-sm flex items-center gap-2 px-2 py-2">

      {/* ── Search ── */}

      <motion.div
        layout
        transition={spring}
        onClick={!isExpanded ? openSearch : undefined}
        className={cn(
          'flex items-center bg-white dark:bg-card rounded-full shadow-lg h-[52px] overflow-hidden cursor-pointer shrink-0',
          isExpanded
            ? 'w-[200px] xs:w-[160px] sm:w-[200px] md:w-[240px] px-4'
            : 'w-[52px] justify-center'
        )}
      >
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <motion.div
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? '100%' : '0px', marginLeft: isExpanded ? '8px' : '0px' }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden flex items-center"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search…"
            className="border-0 outline-none bg-transparent text-sm w-full focus-visible:ring-0 placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.12 }}
              onClick={e => { e.stopPropagation(); closeSearch() }}
              className="ml-1 shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Category tabs ── */}
      <div className="flex items-center bg-white dark:bg-card rounded-full shadow-lg h-[52px] min-w-0 flex-1">

        {/* Left chevron */}
        <button
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-7 h-full pl-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable strip — this is the only thing that scrolls */}
        <div
          ref={tabsRef}
          className="flex items-center gap-0.5 overflow-x-auto h-full flex-1 min-w-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORY_TABS.map(tab => {
            const isActive = activeCategory === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 outline-none transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-bubble"
                    className="absolute inset-0 z-0 bg-primary/10 dark:bg-primary/20 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <tab.Icon className={cn('w-4 h-4 relative z-10 shrink-0', isActive && 'text-primary')} />
                {/* Show label always — the strip scrolls to accommodate */}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right chevron */}
        <button
          onClick={() => scrollTabs('right')}
          className="shrink-0 flex items-center justify-center w-7 h-full pr-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
